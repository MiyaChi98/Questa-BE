import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateQuizDtoArray } from "src/dto/createQuiz.dto";
import { UpdateQuizContentDto } from "src/dto/updateQuiz.dto";
// import mammoth = require("mammoth");
import { InjectModel } from "@nestjs/mongoose";
import { Quiz } from "src/schema/quiz.schema";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
import Joi = require("joi");
import { UserService } from "src/user/user.service";
import { CourseService } from "src/course/course.service";
import { Exam } from "src/schema/exam.schema";
import reader = require("xlsx");
import sharp from 'sharp'
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import crypto from 'crypto'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"





@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private QuizModel: Model<Quiz>,
    @InjectModel(Exam.name) private ExamModel: Model<Exam>,
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    private configService: ConfigService,
  ) {}

  async quizIdentify(userID: string, examId: string) {
    const teacher = await this.userService.findOnebyID(userID);
    const exam = await this.ExamModel.findById(examId);
    if (!exam) {
      throw new BadRequestException("There no exam like that");
    }
    // const course = await this.courseService.findOnebyID(exam.courseId);
    if (!teacher || exam.teacherId?.toString() != teacher._id?.toString())
      throw new BadRequestException(
        "Indentify failed! You not this course teacher",
      );
    const info = {
      teacher: {
        teacherName: teacher.name,
        teacherEmail: teacher.email,
        teacherPhone: teacher.phone,
      },
      exam,
    };
    return info;
  }
  async createS3(){
   const bucketName = process.env.BUCKET_NAME
   const region = process.env.BUCKET_REGION
   const accessKeyId = process.env.ACCESS_KEY
   const secretAccessKey = process.env.SECRET_ACCESS_KEY
   const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })
    return {
      bucketName,
      S3: s3Client
    }
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createQuizDto: CreateQuizDtoArray, userID: string) {
    // this.quizIdentify(userID,CreateQuizDtoArray)
    return this.QuizModel.create(
      createQuizDto.arrayOfObjectsDto,
    );
  }

  async createUsingUploadFile(
    teacherId: string,
    examId: string,
    file: Express.Multer.File,
  ) {
    await this.quizIdentify(teacherId, examId);
    const datas = await this.uploadFile(file);
    const quizzes = [];
    for (const i in datas) {
      quizzes.push(
        await this.QuizModel.create({
          teacherId: teacherId,
          examId: examId,
          content: datas[i],
        }),
      );
    }
    return quizzes;
  }

  async uploadFile(file: Express.Multer.File) {
    const QuizValidate = Joi.object({
      question: Joi.string().required(),
      img: Joi.string(),
      A: Joi.string().required(),
      B: Joi.string().required(),
      C: Joi.string(),
      D: Joi.string(),
      answer: Joi.string().required(),
    }).options({
      abortEarly: false,
    });
    const dataxlsx = await reader.readFile(file.path);
    const data = [];
    const sheets = dataxlsx.SheetNames;
    for (let i = 0; i < sheets.length; i++) {
      const temp = await reader.utils.sheet_to_json(
        dataxlsx.Sheets[sheets[i]],
        { defval: "" },
      );
      temp.forEach((res) => {
        const validate = QuizValidate.validate(res);
        if (validate.error) {
          throw new BadRequestException(validate.error);
        } else data.push(validate.value);
      });
    }
    return data;
  }

  async exportFile(examId: string, userID: string) {
    await this.quizIdentify(userID, examId);
    const allQuiz = await this.findbyExam(examId);
    const ws = reader.utils.json_to_sheet(allQuiz);
    const wb = reader.utils.book_new();
    reader.utils.book_append_sheet(wb, ws, "Test");
    // return wb
    const file = reader.write(wb, {
      bookType: "xlsx",
      type: "buffer",
    });
    return file;
  }

  async uploadImg_Audio(file: Express.Multer.File) {
    const {bucketName,S3} = await this.createS3()
    const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
    // const fileBuffer = await sharp(file.buffer)
    // .resize({ height: 1920, width: 1080, fit: "contain" })
    // .toBuffer()
    const fileName = generateFileName()
    const uploadParams = {
      Bucket: bucketName,
      Body: file.buffer,
      Key: fileName,
      ContentType: file.mimetype
    }
    await S3.send(new PutObjectCommand(uploadParams))
    const getParams = {
      Bucket: bucketName,
      Key: fileName,
    }
    const command = new GetObjectCommand(getParams);
    const fileUrl = await getSignedUrl(
      S3,
      command
      ,
      { expiresIn: 3600 }
    )
    return {
      fileUrl: fileUrl,
      s3Name: fileName
    }
  }

  async getImg_Audio(fileName) {
    const {bucketName,S3} = await this.createS3()
    const getParams = {
      Bucket: bucketName,
      Key: fileName,
    }
    const command = new GetObjectCommand(getParams);
    const fileUrl = await getSignedUrl(
      S3,
      command
      ,
      { expiresIn: 3600 }
    )
    return {
      fileUrl: fileUrl,
      s3Name: fileName
    }
  }

  async findbyExam(id: string) {
    const allQuiz = await this.QuizModel.find({ examId: id })
      .select("quizId")
      .select("content")
      .sort("quizId");
    const result = [];
    allQuiz.forEach(function (obj) {
      result.push({
        quizId: obj._id.toString(),
        question: obj.content.question,
        img: obj.content.img,
        audio: obj.content.audio,
        A: obj.content.A,
        B: obj.content.B,
        C: obj.content.C,
        D: obj.content.D,
        answer: ''
      });
    });
    return result;
  }

  async findOne(id: string) {
    const obj = await this.QuizModel.findOne({ _id: id })
      .select("quizId")
      .select("content");
    if (!obj) {
      throw new BadRequestException("There no quiz with that ID");
    }
    const result = {
      quizId: obj._id.toString(),
      question: obj.content,
    };
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateQuizContent(id: string, updateQuizDto: UpdateQuizContentDto) {
    await this.QuizModel.updateOne({ _id: id }, [
      { $addFields: { content: updateQuizDto } },
    ]);
    return this.QuizModel.findOne({ _id: id });
  }

  async remove(id: string) {
    await this.QuizModel.deleteOne({ _id: id });
    return "Delete quiz success";
  }
}
