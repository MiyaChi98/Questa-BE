import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Test } from "@nestjs/testing";
import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { JwtModule } from "@nestjs/jwt";
import { PaginationDto } from "src/dto/pagination.dto";

describe("CatsController", () => {
  let userController: UserController;
  let userService: DeepMocked<UserService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: createMock<UserService>(),
        },
      ],
    }).compile();
    userService = moduleRef.get(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });
  describe("findAll", () => {
    it("should a defined result", async () => {
      const pagination: PaginationDto = {
        page: 1,
        limit: 10,
      };
      const result = await userController.getAllUser(pagination);
      expect(result.page).toBeDefined();
      expect(result.numberOfUser).toBeDefined();
      expect(result.allUSer).toBeDefined();
    });
  });
});
