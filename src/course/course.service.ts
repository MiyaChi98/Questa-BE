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

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private CourseModel: Model<Course>,
    @InjectModel(Exam.name) private ExamModel: Model<Exam>,
    @InjectModel(User.name) private UserModel: Model<User>,
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
        id: teacher._id,
        teacherName: teacher.name,
        teacherEmail: teacher.email,
        teacherPhone: teacher.phone,
      },
      course: {
        id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
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
  async create(createCourseDto: CreateCourseDto) {
    const courseTeacher = await this.userService.findOnebyID(
      createCourseDto.teacherId,
    );
    if (!courseTeacher)
      throw new BadRequestException("There is no teacher like that!");
    const createdUser = await this.CourseModel.create(createCourseDto);
    return createdUser;
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
      courseId: info.course.id,
    });
    const allStudent = [];
    allStudent_List.map(async (x) => {
      const student = await this.userService.findStudent(x.studentId);
      allStudent.push(student);
    });
    const allExam = await this.ExamModel.find({ courseId: info.course.id });
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

  async update(id: string, updateCourseDto: UpdateCourseDto, userID: string) {
    const updateCourse = await this.CourseModel.findOne({ _id: id });
    if (!updateCourse)
      throw new BadRequestException("There is no course like that!");
    await updateCourse.updateOne({
      ...updateCourseDto,
    });
    return await this.findOne(id, userID);
  }

  async findAllStudent(id: string, userID: string) {
    const course = await this.CourseModel.findOne({ _id: id }).select(
      "studentId",
    );
    const result = {
      courseId: await this.findOne(id, userID),
      allStudentInfo: [],
    };
    if (course && course.studentId?.length > 0) {
      for (const i in course.studentId) {
        result.allStudentInfo.push(
          await this.userService.findOnebyID(course.studentId[i]),
        );
      }
    }
    return result;
  }
  async findCourses(teacherID: string) {
    const course = await this.CourseModel.find({ teacherId: teacherID })
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
