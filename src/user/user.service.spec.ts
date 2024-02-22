// import { Test, TestingModule } from "@nestjs/testing";
// import { UserService } from "./user.service";
// import { getModelToken } from "@nestjs/mongoose";
// import { User } from "src/schema/user.schema";
// import { Model } from "mongoose";
// import { PaginationDto } from "src/dto/pagination.dto";
// import { CreateUserDto } from "src/dto/createUser.dto";
// import { Role } from "src/constant/roleEnum";

describe("AppController", () => {
  describe("MyTestSuite", () => {
    it("should pass", () => {
      expect(1 + 1).toEqual(2);
    });
  });
});


// describe("UserService", () => {
//   let userService: UserService;
//   let model: Model<User>;
//   const mockfindAll = {
//     page: 1,
//     numberOfUser: 47,
//     allUSer: [
//       {
//         _id: "6555d99203662be4325a2838",
//         email: "bshelford4@gnu.org",
//         name: "Brana Shelford",
//         phone: "8368317599",
//         zone: ["teacher"],
//         updatedAt: "2023-12-27T06:23:29.316Z",
//       },
//       {
//         _id: "6555d99203662be4325a2839",
//         email: "rhadgraft5@dot.gov",
//         name: "Rivalee Hadgraft",
//         phone: "1975180624",
//         zone: ["teacher"],
//       },
//     ],
//   };
//   const mockfinbyId = {
//     _id: "6555d99203662be4325a2839",
//     email: "rhadgraft5@dot.gov",
//     name: "Rivalee Hadgraft",
//     phone: "1975180624",
//     zone: ["teacher"],
//   };
//   const pagination: PaginationDto = {
//     page: 1,
//     limit: 10,
//   };
//   const mockUserService = {
//     find: jest.fn(),
//     findById: jest.fn(),
//     countDocuments: jest.fn(),
//     create: jest.fn(),
//   };
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: getModelToken(User.name),
//           useValue: mockUserService,
//         },
//       ],
//     }).compile();

//     userService = module.get<UserService>(UserService);
//     model = module.get<Model<User>>(getModelToken(User.name));
//   });
//   describe("findall", () => {
//     it("should return an correct results", async () => {
//       jest.spyOn(model, "find").mockImplementation(
//         () =>
//           ({
//             skip: () => ({
//               limit: jest.fn().mockResolvedValue(mockfindAll),
//             }),
//           }) as any
//       );
//       jest
//         .spyOn(model, "countDocuments")
//         .mockResolvedValue(mockfindAll.allUSer.length);
//       const result = await userService.findAll(
//         pagination.page,
//         pagination.limit
//       );
//       expect(result.page).toBeDefined();
//       expect(result.numberOfUser).toBeDefined();
//       expect(result.numberOfUser).toBeGreaterThan(0);
//       expect(Array.isArray(result.allUSer)).toBeDefined();
//     });
//   });

//   describe("findOnebyID", () => {
//     it("should return an correct user", async () => {
//       jest.spyOn(model, "findById").mockResolvedValue(mockfinbyId);
//       const result = await userService.findOnebyID(mockfinbyId._id);
//       expect(model.findById).toHaveBeenCalledWith(mockfinbyId._id, {
//         password: 0,
//       });
//       expect(result).toEqual(mockfinbyId);
//     });
//   });

//   describe("create", () => {
//     it("should create and return a book", async () => {
//       const newUser = {
//         name: "Rivalee Hadgraft",
//         email: "rhadgraft5@dot.gov",
//         password: "Morminiproject98@",
//         phone: "1975180624",
//         zone: Role.ADMIN,
//       };

//       jest
//         .spyOn(model, "create")
//         .mockImplementationOnce(jest.fn().mockResolvedValue(mockfinbyId));

//       const result = await userService.create(newUser as CreateUserDto);

//       expect(result).toEqual(mockfinbyId);
//     });
//   });
// });
