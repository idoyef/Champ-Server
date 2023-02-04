"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.soccerController = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const soccerController = (soccerService) => {
    // router.route('/').post(createSoccerMatch);
    // router.route('/:id').patch(updateSoccerMatch);
    // async function createSoccerMatch(
    //   req: Request,
    //   res: Response,
    //   next: NextFunction
    // ) {
    //   try {
    //     const result = await soccerService.createSoccerMatch(req.body);
    //     return res.status(201).json(result);
    //   } catch (error) {
    //     next(error);
    //   }
    // }
    // async function updateSoccerMatch(
    //   req: Request,
    //   res: Response,
    //   next: NextFunction
    // ) {
    //   try {
    //     const result = await soccerService.updateSoccerMatch(
    //       req.params.id,
    //       req.body
    //     );
    //     return res.json(result);
    //   } catch (error) {
    //     next(error);
    //   }
    // }
    return router;
};
exports.soccerController = soccerController;
//# sourceMappingURL=soccerController.js.map