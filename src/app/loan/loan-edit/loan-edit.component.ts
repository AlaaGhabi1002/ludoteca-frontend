import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoanService } from '../loan.service';
import { Client } from 'src/app/client/model/Client';
import { ClientService } from 'src/app/client/client.service';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';
import { GameService } from 'src/app/game/game.service';
import { Game } from 'src/app/game/model/Game';
import { Loan } from '../model/Loan';

@Component({
    selector: 'app-loan-edit',
    templateUrl: './loan-edit.component.html',
    styleUrls: ['./loan-edit.component.scss']
})
export class LoanEditComponent implements OnInit {

    id: number | null = null; 
    client: Client | null = null;
    game: Game | null = null;
    startDate: Date | null = null;
    endDate: Date | null = null;

    games: Game[] = [];
    clients: Client[] = [];
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<LoanEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private loanService: LoanService,
        private gameService: GameService,
        private clientService: ClientService,
    ) { }

    ngOnInit(): void {
        if (this.data.loan != null) {
            this.id = this.data.loan.id;
            this.game = this.data.loan.game;
            this.client = this.data.loan.client;
            this.startDate = this.parseDate(this.data.loan.startDate);
              this.endDate = this.parseDate(this.data.loan.endDate);

        }
       
        

        this.gameService.getGames().subscribe(
            games => {
                this.games = games;

            }
        );

        this.clientService.getClients().subscribe(
            clients => {
                this.clients = clients

            }
        );
      }
    

    onSave() {

      if (this.startDate != null && this.endDate != null){
        const days = Math.round((this.endDate.getTime() - this.startDate.getTime()) / 86400000) + 1;
        if (days > 14){
          alert('El prestamo no puede durar mas de 14 dias');
          return;
        }
      }
      const loan={
        id: this.id,
        game:this.game,
        client: this.client,
        startDate: this.formatDate(this.startDate),
        endDate: this.formatDate(this.endDate),
      };

        this.loanService.saveLoan(loan as any).subscribe({
            next: () => this.dialogRef.close(),
            error: () => this.errorMessage = 'No se puede guardar el prestamo. !REVISA los datos! '
        });    
    }  

    onClose() {
        this.dialogRef.close();
    }

    get invalidDates(): boolean{
      return this.startDate != null && this.endDate != null && this.endDate < this.startDate;
    }
    compareById(a: any, b: any): boolean{
return a && b ? a.id === b.id : a===b;


}
private formatDate(date: Date | null): string{
  if (date == null)  return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
 return date.getFullYear() + '-' + month + '-' + day;

}
private parseDate(value: string): Date {
  const parts = value.split('-');
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}
}

