import { Pageable } from "src/app/core/model/page/Pageable";
import { Loan } from "src/app/loan/model/Loan";

export class LoanPage{
    content!: Loan[];
    pageable!: Pageable;
    totalElements!: number;
}