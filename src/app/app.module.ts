import { NgModule,APP_INITIALIZER  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { PageErrorComponent } from './page-error/page-error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppInitializerService } from './services/initializer.service';
import { BookingComponent } from './booking/booking.component';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { OperatorsComponent } from './operators/operators.component';
import { TncComponent } from './tnc/tnc.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { SupportComponent } from './support/support.component';
import { FaqComponent } from './faq/faq.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NewsComponent } from './news/news.component';
import { CareersComponent } from './careers/careers.component';
import { RoutesComponent } from './routes/routes.component';
import { OffersComponent } from './offers/offers.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ManagebookingdetailsComponent } from './managebookingdetails/managebookingdetails.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

import {ToastrModule} from 'ngx-toastr';
import { OtpComponent } from './otp/otp.component'

import { NgbDate, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomdateformatService } from "./services/customdateformat.service";

import { NgxSpinnerModule } from "ngx-spinner";

export function appInit(appInitializerService: AppInitializerService) {
  return () => appInitializerService.load();
}

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SearchComponent,
    PageErrorComponent,
    BookingComponent,
    TestimonialsComponent,
    OperatorsComponent,
    TncComponent,
    PrivacyPolicyComponent,
    ManageBookingComponent,
    SupportComponent,
    FaqComponent,
    ThankyouComponent,
    ContactUsComponent,
    AboutUsComponent,
    NewsComponent,
    CareersComponent,
    RoutesComponent,
    OffersComponent,
    ManagebookingdetailsComponent,
    SignupComponent,
    LoginComponent,
    OtpComponent
  ],
  imports: [
    BrowserModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    NgWizardModule.forRoot(ngWizardConfig),
    AutocompleteLibModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule
  ],
  providers: [AppInitializerService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [AppInitializerService]
    },{provide: NgbDateParserFormatter, useClass: CustomdateformatService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
