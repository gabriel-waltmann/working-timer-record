import { Router } from "express";
import multer from "multer";

// TODO: Imprement ts paths
import { BankToNotionController } from "../controllers/bank-to-notion-controller";
import { CreateBankToNotionUseCase } from "../../application/use-cases/bank-to-notion/create-bank-to-notion-use-case";
import { RetrievesBankToNotionUseCase } from "../../application/use-cases/bank-to-notion/retrieves-bank-to-notion-use-case";
import { BankToNotionRepositoryImp } from "../../infrastructure/database/bank-to-notion-repository-imp";

const bankToNotionRepository = new BankToNotionRepositoryImp();

const createBankToNotionUseCase = new CreateBankToNotionUseCase(bankToNotionRepository);
const retrievesBankToNotionUseCase = new RetrievesBankToNotionUseCase(bankToNotionRepository);

const bankToNotionController = new BankToNotionController(
  createBankToNotionUseCase,
  retrievesBankToNotionUseCase
);

const router = Router();

const upload = multer({
  dest: "uploads/bank-to-notion",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post("/", upload.single('pdf'), bankToNotionController.create.bind(bankToNotionController));

router.get("/", bankToNotionController.retrieves.bind(bankToNotionController));

export default router;