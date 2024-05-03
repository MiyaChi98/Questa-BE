import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateCourseDto } from "../dto/createCourse.dto";
import { UpdateCourseDto } from "../dto/updateCourse.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Course } from "src/schema/course.schema";
import { UserService } from "src/user/user.service";
import { StudentList } from "src/schema/studentlist.schema";
import { Exam } from "src/schema/exam.schema";
import { Role } from "src/constant/roleEnum";
import { addStudentDTO } from "src/dto/addStudent.dto";
import { User } from "src/schema/user.schema";
import { Submit } from "src/schema/submit.schema";

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private CourseModel: Model<Course>,
    @InjectModel(Exam.name) private ExamModel: Model<Exam>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Submit.name) private SubmitModel: Model<Submit>,
    @InjectModel(StudentList.name)
    private Student_List_Model: Model<StudentList>,
    private readonly userService: UserService,
  ) {}

  async courseIdentify(userID: string, courseId: string) {
    const user = await this.userService.findOnebyID(userID);
    const course = await this.CourseModel.findById(courseId);
    let teacher;
    if (!user) {
      throw new BadRequestException(`This user not exist !`);
    }
    if (!course) {
      throw new BadRequestException(`This course not exist !`);
    }
    if (course.teacherId?.toString() != user._id?.toString()) {
      if (user.zone[0] === Role.STUDENT) {
        const student = await this.Student_List_Model.find(
          {
            studentId: user._id,
            courseId: courseId,
          },
          {
            _id: 0,
          },
        );
        if (student.length != 0) {
          teacher = await this.userService.findOnebyID(course.teacherId);
        } else
          throw new BadRequestException(`You're not student of this course`);
      }
      if (user.zone[0] === Role.TEACHER) {
        throw new BadRequestException(`You're not teacher of this course`);
      }
    } else teacher = user;
    const info = {
      teacher: {
        _id: teacher._id,
        teacherName: teacher.name,
        teacherEmail: teacher.email,
        teacherPhone: teacher.phone,
      },
      course: {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        grade: course.grade,
      },
    };
    return info;
  }
  //add student
  async addStudent(addStudent: addStudentDTO) {
    const Link = await this.Student_List_Model.findOne({
      studentId: addStudent.studentID,
      courseId: addStudent.courseID,
    });
    if (Link)
      throw new BadRequestException("The student already in the course");
    const user = await this.UserModel.find({ _id: addStudent.studentID });
    const course = await this.CourseModel.find({ _id: addStudent.courseID });
    if (user.length != 0 && course.length != 0) {
      const newLink = await this.Student_List_Model.create({
        studentId: addStudent.studentID,
        courseId: addStudent.courseID,
      });
      return newLink;
    } else {
      throw new BadRequestException("not resolve");
    }
  }
  // Create course
  async create(createCourseDto: CreateCourseDto, teacherId: string) {
    const createdCourse = await this.CourseModel.create({
      ...createCourseDto,
      teacherId: teacherId,
    });
    return createdCourse;
  }
  async findOnebyID(courseId: string) {
    return this.CourseModel.findOne({ _id: courseId });
  }
  // Find All Course with Teacher info
  async findAll(page: number, limit: number) {
    const allCourse = await this.CourseModel.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const numberOfCourse = await this.CourseModel.countDocuments();
    const numberOfPage = Array.from(
      { length: Math.ceil(numberOfCourse / limit) },
      (_, i) => i + 1,
    );
    return {
      page: page,
      numberOfPage: numberOfPage,
      numberOfCourse: numberOfCourse,
      allCourse,
    };
  }
  // Find one Course with Teacher info ,all the student and all the exam
  async findOne(id: string, userID: string) {
    const info = await this.courseIdentify(userID, id);
    const allStudent_List = await this.Student_List_Model.find({
      courseId: info.course._id,
    });
    const allStudent = [];
    allStudent_List.map(async (x) => {
      const student = await this.userService.findStudent(x.studentId);
      allStudent.push(student);
    });
    const allExam = await this.ExamModel.find({ courseId: info.course._id });
    const result = {
      ...info,
      student: allStudent,
      exams: allExam,
    };
    return result;
  }
  // Find Course with name
  findName(name: string) {
    return this.CourseModel.findOne({ courseName: name });
  }
  calculateAverage(array) {
    if (array.length === 0) {
        return 0; // Return 0 if array is empty to avoid division by zero
    }

    const sum = array.reduce((acc, curr) => acc + curr, 0);
    return sum / array.length;
}
  async update(id: string, updateCourseDto: UpdateCourseDto, userID: string) {
    const updateCourse = await this.CourseModel.findOne({ _id: id });
    if (!updateCourse)
      throw new BadRequestException("There is no course like that!");
    await updateCourse.updateOne({
      ...updateCourseDto,
    });
    return await this.findOne(id, userID);
  }

  async findAllStudent(id: string) {
    const allStudent = await this.Student_List_Model.find({
      courseId: id,
    });
    const list = []
    const allExam = await this.ExamModel.find({courseId: id})
    for(const link of allStudent){
      const student = await this.UserModel.findOne(
        {_id: link.studentId},
        {
          password: 0,
          refreshToken:0
        }
      )
      let studentSubmition = 0
      let mark= []
      for(const exam of allExam){
        const submition = await this.SubmitModel.findOne({
          examId: exam._id,
          studentId: student._id
        })
        if(submition){
          studentSubmition++
          mark.push(submition.mark)
        } else studentSubmition
      }
      const nowAvg = this.calculateAverage(mark)
      mark.pop()
      const beforeAvg = this.calculateAverage(mark)
      list.push({
        _id: student._id,
        name: student.name,
        email: student.email,
        submition : `${studentSubmition}/${allExam.length}`,
        status:{
          now: nowAvg,
          before: beforeAvg,
          status: nowAvg >= beforeAvg
        }
      })
    }
    return list;
  }
  async findCourses(teacherID: string) {
    const course = await this.CourseModel.find({ teacherId: teacherID });
    return course;
  }
  async delete(id: string) {
    const course = await this.CourseModel.findOneAndDelete({ _id: id });
    const allExam = await this.ExamModel.find({ courseId: id });
    await this.ExamModel.deleteMany({ courseId: id });
    return {
      ...course,
      ...allExam,
    };
  }
}
