// import { BadRequestException } from '@nestjs/common';
// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import {
//   Quizschema,
//   QuizType,
// } from 'src/validation/validationSchema/quizSchema';

// export const Quiz = createParamDecorator((data: any, ctx: ExecutionContext) => {
//   const reqest = ctx.switchToHttp().getRequest();
//   const quiz: QuizType = reqest.body;
//   try {
//     Quizschema.parse(quiz);
//   } catch (error) {
//     throwError('Schema Validation failed')
//   }
//   (quiz.quizId)&&(Number.isInteger(quiz.quizId)) ? '' : throwError('Check quizId field !');
//   (quiz.content.question) ? '' : throwError('Fill the question field !')
//   return quiz;
// });

// function throwError(x)
// {
//     throw new BadRequestException(x);
// }
