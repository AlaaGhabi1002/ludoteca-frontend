import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Pageable } from 'src/app/core/model/page/Pageable';
import { LoanService } from '../loan.service';
import { Loan } from '../model/Loan';
import{Game} from  'src/app/game/model/Game';
import{GameService} from  'src/app/game/game.service';
import{Client} from  'src/app/client/model/Client';
import{ClientService} from  'src/app/client/client.service';
import { LoanEditComponent } from '../loan-edit/loan-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';

@Component({
selector: 'app-loan-list',
templateUrl: './loan-list.component.html',
styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {

    pageNumber: number = 0;
    pageSize: number = 4;
    totalElements: number = 0;

    dataSource = new MatTableDataSource<Loan>();
    displayedColumns: string[] = ['id', 'game', 'client', 'startDate', 'endDate', 'action'];

    games:Game[]=[];
    clients: Client[]=[];
    filterGame: Game | null = null;
    filterClient: Client | null =null;
    filterDate : Date | null = null;
    constructor(
        private loanService: LoanService,
        private gameService: GameService,
        private clientService: ClientService,
        public dialog: MatDialog,
        
    ) { }

    ngOnInit(): void {
        this.loadPage();

        this.gameService.getGames().subscribe(games => this.games = games);
         this.clientService.getClients().subscribe(clients => this.clients = clients);
    }

    loadPage(event?: PageEvent) {

        let pageable : Pageable =  {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: [{
                property: 'id',
                direction: 'ASC'
            }]
        }

        if (event != null) {
            pageable.pageSize = event.pageSize
            pageable.pageNumber = event.pageIndex;
        }

        let gameId = this.filterGame != null ? this.filterGame.id : undefined;
        let clientId = this.filterClient != null ? this.filterClient.id : undefined;
        let date = this.filterDate != null ? this.formatDate(this.filterDate) : undefined;

        this.loanService.getLoans(pageable, gameId, clientId, date).subscribe(data => {
            this.dataSource.data = data.content;
            this.pageNumber = data.pageable.pageNumber;
            this.pageSize = data.pageable.pageSize;
            this.totalElements = data.totalElements;
        });
      }

    onSearch(): void{
        this.pageNumber = 0;
        this.loadPage();
    }

    onCleanFilter(): void {
        this.filterGame = null;
        this.filterClient = null;
        this.filterDate = null;
        this.onSearch();
    }

    createLoan(){
        const dialogRef = this.dialog.open(LoanEditComponent,{
            data: {}
        });
        dialogRef.afterClosed().subscribe(() => {
            this.loadPage();
        });

    }

     editLoan(loan: Loan){
        const dialogRef = this.dialog.open(LoanEditComponent,{
            data: {loan: loan}
        });
        dialogRef.afterClosed().subscribe(() => {
            this.loadPage();
        });

    }

    private formatDate(d: Date): string{
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${month}-${day}`;
    }

    deleteLoan(loan: Loan) {    
        const dialogRef = this.dialog.open(DialogConfirmationComponent, {
          data: { title: "Eliminar prestamo", description: "Atención si borra el prestamo se perderá.<br> ¿Desea eliminar el prestamo?" }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loanService.deleteLoan(loan.id).subscribe(result => {
              this.loadPage();
            }); 
          }
        });
      }  



    
    
    
    
    
    
    
    
    
    
    
    
    
    }
