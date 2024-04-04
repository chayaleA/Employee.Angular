import { NgModule } from "@angular/core";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { HomeComponent } from "./components/home/home.component";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    declarations: [PageNotFoundComponent, HomeComponent],
    providers: [],
    imports: [CommonModule, RouterLink, HttpClientModule, RouterLink,
        ReactiveFormsModule, FormsModule],
    exports: [PageNotFoundComponent, HomeComponent]
})
export class HomeModule{

}