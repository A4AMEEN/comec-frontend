import { CommonModule } from '@angular/common';
import { Component, inject, OnInit,AfterViewInit, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { TreeSelectModule } from 'primeng/treeselect';
import { CompanyService } from '../../core/services/company.service';
import Swal from 'sweetalert2';
import { catchError, map, Observable, tap } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Location } from '@angular/common'; 
import { ThemeService } from '../../core/services/theme.service';

interface BuisnessNature {
  value: string;
  code: string;
}

@Component({
  selector: 'app-project-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TreeSelectModule,
    DropdownModule,
    ButtonModule,
    SelectModule,
],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {

  private companyService = inject(CompanyService)
  private route=inject(ActivatedRoute)
  public isCompanySelected: boolean = false;
  companyId!:any
  tabs: any[] = ["Company Info", "Shares Info", "Directors", "Company Secretary"];
  shareCapitalList:any[]= []
  shareholders: any[] = [];
  activeTabIndex = 0;
  currentHolder:any
  showForm:boolean = false;
  shareholderTabIndex:number=2
  DirectorTabIndex:number=3
  invateShareHolderForm:boolean = false
  imagePreview: string | null = null;
  imagePreviewDirectorsId: string | ArrayBuffer | null = null; 
  imagePreviewDirectorsAddressProof: string | ArrayBuffer | null = null;
  imagePreviewCompanySecretaryId: string | ArrayBuffer | null = null;
  imagePreviewCompanySecretaryAddressProof: string | ArrayBuffer | null = null;
  addressProofDirectors: string | ArrayBuffer | null = null;
  directorsInfoOpen:boolean = false
  directorInvateOpen:boolean = false
  addressProofPreview: string | null = null;
  idProofPreview: string | ArrayBuffer | null = null; 
  companyInfoForm!: FormGroup;
  addShareForm!: FormGroup;
  shareHoldersForm!:FormGroup;
  inviteShareholderForm!:FormGroup
  directorInformationForm!:FormGroup
  directorsInformation:any[]=[]
  InviteDirectorsForm!:FormGroup
  comapnySecretaryForm!:FormGroup
  selectedDirectorUserType: string = 'person';
  selectedNodes: string = "";
  selectedCountry = ""
  userData:any
  userId: any;
  invitationToken: string | null = null;
  invitationData: any = null;
  isInvitationValid = false;
  isLoading = false;
  errorMessage = '';
  private router = inject(Router)
  private authservice = inject(AuthService)
  private themeService = inject(ThemeService)
  constructor(
    private location: Location
  ) {
    // Subscribe to router events to handle browser back/forward
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     // Get tab index from URL if present
    //     const tabIndex = this.getTabIndexFromUrl();
    //     if (tabIndex !== null) {
    //       this.activeTabIndex = tabIndex;
    //     }
    //   }
    // })
  }
  countries: any[] = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
  ];

  buisnessNature = [{
    value: "Crop and animal production, hunting.",
    code: "001"
  }, {
    value: "Forestry activities",
    code: "002"
  }, {
    value: "Fishing and aquaculture",
    code: "003"
  }, {
    value: "Mining of coal and lignite",
    code: "005"
  }, {
    value: "Extraction of crude petroleum and natural gas",
    code: "006"
  }, {
    value: "Mining of metal ores",
    code: "007"
  }, {
    value: "Quarrying and other mining of non-metal ores",
    code: "008"
  }, {
    value: "Mining support service activities",
    code: "009"
  }, {
    value: "Manufacture of food products",
    code: "010"
  }, {
    value: "Manufacture of beverages",
    code: "011"
  }, {
    value: "Manufacture of tobacco products",
    code: "012"
  }, {
    value: "Manufacture of textiles",
    code: "013"
  }, {
    value: "Manufacture of wearing apparel",
    code: "014"
  }, {
    value: "Manufacture of leather and related products",
    code: "015"
  }, {
    value: "Manufacture of wood and of products of wood and cork, articles of straw and plaiting materials (except furniture and toys)",
    code: "016"
  }, {
    value: "Manufacture of paper and paper products",
    code: "017"
  }, {
    value: "Printing and reproduction of recorded media",
    code: "018"
  }, {
    value: "Manufacture of coke and refined petroleum products",
    code: "019"
  }, {
    value: "Manufacture of chemicals and chemical products",
    code: "020"
  }, {
    value: "Manufacture of pharmaceuticals, medicinal chemical and botanical products",
    code: "021"
  }, {
    value: "Manufacture of rubber and plastics products (except furniture, toys, sports goods and stationery)",
    code: "022"
  }, {
    value: "Manufacture of other non-metallic mineral products",
    code: "023"
  }, {
    value: "Manufacture of basic metals",
    code: "024"
  }, {
    value: "Manufacture of fabricated metal products (except machinery and equipment)",
    code: "025"
  }, {
    value: "Manufacture of computer, electronic and optical products",
    code: "026"
  }, {
    value: "Manufacture of electrical equipment",
    code: "027"
  }, {
    value: "Manufacture of machinery and equipment n.e.c.",
    code: "028"
  }, {
    value: "Body assembly of motor vehicles",
    code: "029"
  }, {
    value: "Manufacture of other transport equipment",
    code: "030"
  }, {
    value: "Manufacture of furniture",
    code: "031"
  }, {
    value: "Other manufacturing",
    code: "032"
  }, {
    value: "Repair and installation of machinery and equipment",
    code: "033"
  }, {
    value: "Electrcity and Gas Supply",
    code: "035"
  }, {
    value: "Water collection, treatment and supply",
    code: "036"
  }, {
    value: "Sewerage",
    code: "037"
  }, {
    value: "Waste collection, treatment and disposal activities; materials recovery",
    code: "038"
  }, {
    value: "Remediation activities and other waste management services",
    code: "039"
  }, {
    value: "Construction of buildings",
    code: "041"
  }, {
    value: "Civil engineering",
    code: "042"
  }, {
    value: "Specialised Construction Activities",
    code: "043"
  }, {
    value: "Import and export trade ",
    code: "045"
  }, {
    value: "Wholesale",
    code: "046"
  }, {
    value: "Retail Trade",
    code: "047"
  }, {
    value: "Land Transport",
    code: "049"
  }, {
    value: "Water Transport",
    code: "050"
  }, {
    value: "Air Transport",
    code: "051"
  }, {
    value: "Warehousing and support activities for transportation",
    code: "052"
  }, {
    value: "Postal and courier activities",
    code: "053"
  }, {
    value: "Short term accommodation activities",
    code: "055"
  }, {
    value: "Food and beverage service activities",
    code: "056"
  }, {
    value: "Publishing activities",
    code: "058"
  }, {
    value: "Motion picture, video and television programme production, sound recording and music publishing activities",
    code: "059"
  }, {
    value: "Programming and broadcasting activities",
    code: "060"
  }, {
    value: "Telecommunications",
    code: "061"
  }, {
    value: "Information technology service activities",
    code: "062"
  }, {
    value: "Information service activities",
    code: "063"
  }, {
    value: "Financial service activities, including investment and holding companies, and the activities of trusts, funds and similar financial entities.",
    code: "064"
  }, {
    value: "Insurance (including pension funding) ",
    code: "065"
  }, {
    value: "Activities auxiliary to financial service and insurance activities",
    code: "066"
  }, {
    value: "Real estate activities",
    code: "068"
  }, {
    value: "Legal and accounting activities",
    code: "069"
  }, {
    value: "Activities of head offices; management and management consultancy activities",
    code: "070"
  }, {
    value: "Architecture and engineering activities, technical testing and analysis",
    code: "071"
  }, {
    value: "Scientific research and development",
    code: "072"
  }, {
    value: "Veterinary activities",
    code: "073"
  }, {
    value: "Advertising and market research",
    code: "074"
  }, {
    value: "Other professional, scientific and technical activities",
    code: "075"
  }, {
    value: "Rental and leasing activities",
    code: "077"
  }, {
    value: "Employment activities",
    code: "078"
  }, {
    value: "Travel agency, reservation service and related activities",
    code: "079"
  }, {
    value: "Security and investigation activities ",
    code: "080"
  }, {
    value: "Services to buildings and landscape care activities",
    code: "081"
  }, {
    value: "Office administrative, office support and other business support activities",
    code: "082"
  }, {
    value: "Public administration",
    code: "084"
  }, {
    value: "Education",
    code: "085"
  }, {
    value: "Human health activities",
    code: "086"
  }, {
    value: "Residential care activities",
    code: "087"
  }, {
    value: "Social work activities without accommodation",
    code: "088"
  }, {
    value: "Creative and performing arts activities",
    code: "090"
  }, {
    value: "Libraries, archives, museums and other cultural activities",
    code: "091"
  }, {
    value: "Activities of amusement parks and theme parks",
    code: "092"
  }, {
    value: "Sports and other entertainment activities",
    code: "093"
  }, {
    value: "Activities of membership organisations",
    code: "094"
  }, {
    value: "Repair of motor vehicles, motorcycles, computers, personal and household goods",
    code: "095"
  }, {
    value: "Other personal service activities",
    code: "096"
  }, {
    value: "Activities of households as employers of domestic personnel",
    code: "097"
  }, {
    value: "Goods and services producing activities of private households for own use ",
    code: "098"
  }, {
    value: "Activities of extraterritorial organisations and bodies",
    code: "099"
  }]
  isDarkTheme:Boolean=false
  private fb = inject(FormBuilder)
  isAuthenticated:Boolean=false
  ngOnInit() {
    this.initializeCompanyInfoForm()
    this.initializeAddSharesForm()
    this.initializeSharesHoldersForm()
    this.initializeInvateSharesHoldersForm()
    this.initializeDirectorInfoForm()
    this.initializeInvateDirectorForm()
    this.initializeCompanySecretaryForm()
    this.getUserDatas()
    this.themeService.isDarkTheme$.subscribe(
      isDark => {
        this.isDarkTheme = isDark;
        this.applyTheme();
      }
    );
    const savedCompanyId = localStorage.getItem('companyId');
  if (savedCompanyId) {
    this.companyId = savedCompanyId;
    console.log('found saved one',this.companyId);
    
  }
    this.userData = this.authservice.getUserId()
    this.visitedTabs[0] = true;
    if (this.authservice.isLoggedIn()) {
      this.isAuthenticated = true;
      this.getUserDatas();
    } else {
      // Check for invitation token
      this.route.queryParams.subscribe(params => {
        this.invitationToken = params['token'];
        this.companyId = params['companyId'] 
    ? decodeURIComponent(params['companyId']).trim().replace(/\\$/, '') 
    : null;
    
  console.log('Cleaned companyId:', this.companyId);
;
        // console.log('compeeeeeee',this.companyId);
        
        
        
        if (this.invitationToken) {
          this.validateInvitationToken();
        } else {
          // Neither logged in nor has token - shouldn't reach here due to guard
          this.router.navigate(['/login']);
        }
      });
    }
  
    // Check URL for tab index
    const urlTabIndex = this.getTabIndexFromUrl();
    if (urlTabIndex !== null) {
      // Mark all tabs up to current one as visited
      for (let i = 0; i <= urlTabIndex; i++) {
        this.visitedTabs[i] = true;
      }
      this.activeTabIndex = urlTabIndex;
    }

    this.route.queryParams.subscribe(params => {
      this.companyId = params['companyId'] 
    ? decodeURIComponent(params['companyId']).trim().replace(/\\$/, '') 
    : null;
    
  console.log('Cleaned companyId:', this.companyId);

      if (params['fromEmail']) {
        this.activeTabIndex = 2; 
        this.fetchDirectorsInfo();
      }
    });

    const publicRadioEl = document.querySelector('input[value="public"]');
  if (publicRadioEl) {
    publicRadioEl.setAttribute('disabled', 'disabled');
  }

    this.route.queryParams.subscribe(params => {
      this.companyId = params['companyId'] 
    ? decodeURIComponent(params['companyId']).trim().replace(/\\$/, '') 
    : null;
    
  console.log('Cleaned companyId:', this.companyId);

      
      if (params['fromShare']) {
        this.activeTabIndex = 1; 
        this.getShareCapitalList();
        this.getShareHoldersList();
      }
    });
    

    this.companyInfoForm.get('country_Address')?.disable();
    this.companyInfoForm.get('presentorReferance')?.disable();
  }

  ngAfterViewInit() {
    const radioButtons = document.querySelectorAll('input[name="companyType"]');
    radioButtons.forEach(radio => {
      radio.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        if (target.value === 'public') {
          // Force selection back to private
          const privateRadio = document.querySelector('input[value="private"]') as HTMLInputElement;
          if (privateRadio) privateRadio.checked = true;
        }
      });
    });
  }

  private validateInvitationToken() {
    this.isLoading = true;
    console.log('Validating token:', this.invitationToken);
    
    this.companyService.validateInvitationToken(this.invitationToken!)
      .subscribe({
        next: (response) => {
          if (response.valid) {
            this.invitationData = response.invitationData;
            this.isInvitationValid = true;
            
            // Log the user in automatically
            this.autoLoginInvitedUser(response);
          } else {
            this.errorMessage = 'Invalid or expired invitation.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Failed to validate invitation.';
          this.isLoading = false;
        }
      });
  }

  private applyTheme() {
     if (this.isDarkTheme) {
    document.body.classList.add('dark-mode');
    
    // Force PrimeNG components to update their styling
    // You might need to get references to your p-select components
    // For example, if you use ViewChild:
    
  } else {
    document.body.classList.remove('dark-mode');
  }
  }
  
  private autoLoginInvitedUser(response: any) {
    // Set authentication data in localStorage similar to handleLoginSuccess method
    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response.invitationData.id);
    localStorage.setItem('userRole', 'Shareholder');
    localStorage.setItem('shareholderData', JSON.stringify(response.invitationData));
    
    // Now that the user is "logged in", get the user data
    this.getUserDatas();
  }

  getUserDatas() {
    // Get the userId from localStorage directly
    this.userId = localStorage.getItem('userId');
    console.log('userId:', this.userId);
  
    if (this.userId) {
      this.authservice.getUserById(this.userId).subscribe({
        next: (user) => {
          this.userData = user;
          console.log('User data:', this.userData);
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        }
      });
    } else {
      console.log('User is not logged in or userId is not available.');
    }
  }

  initializeCompanyInfoForm(): void {
    this.companyInfoForm = this.fb.group({
      companyNameEN: new FormControl('', [Validators.required, Validators.minLength(3)]),
      companyNameCN: new FormControl('', [Validators.minLength(3)]),
      companyType: [{ value: 'private', disabled: false }, Validators.required],
      natureofCompany: new FormControl<BuisnessNature | null>(null, [Validators.required]),
      code: new FormControl('', [Validators.required]),
      Flat_Address: new FormControl('', [Validators.required, Validators.minLength(10)]),
      Building_Address: new FormControl('', [Validators.minLength(4)]),
      Street_Address: new FormControl('', [Validators.minLength(4)]),
      District_Address: new FormControl('', [Validators.minLength(4)]),
      country_Address: new FormControl('Hong Kong', [Validators.required]),
      company_Email: new FormControl('', [Validators.email]),
    
      company_Telphone: new FormControl('', [
        Validators.pattern(/^\d{10}$/) // Must be exactly 10 digits if entered
      ]),
      company_Fax: new FormControl('', [
        Validators.pattern(/^\d{10}$/) // Must be exactly 10 digits if entered
      ]),
    
      subscriptionDuration: new FormControl('1 year', [Validators.required]),
      presentorName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      presentorChiName: new FormControl('', [Validators.minLength(3)]),
      presentorAddress: new FormControl('', [Validators.required, Validators.minLength(6)]),
      presentorBuilding: new FormControl('', [Validators.minLength(6)]),
      presentorStreet: new FormControl('', [Validators.minLength(6)]),
      presentorDistrict: new FormControl('', [Validators.minLength(6)]),
    
      presentorTel: new FormControl('', [
        Validators.pattern(/^\d{10}$/) // Must be exactly 10 digits if entered
      ]),
      presentorFax: new FormControl('', [
        Validators.pattern(/^\d{10}$/) // Must be exactly 10 digits if entered
      ]),
    
      presentorEmail: new FormControl('', [Validators.email]),
      presentorReferance: new FormControl('CompanyName-NNC1-06-03-2024', [Validators.required]),
      companyLogo: new FormControl(''),
    });
    
    
    

    // Listen for changes on the `natureofCompany` field
    this.companyInfoForm.get('natureofCompany')?.valueChanges.subscribe((selectedNature: BuisnessNature | null) => {
      console.log(selectedNature);

      if (selectedNature) {
        this.companyInfoForm.get('code')?.setValue(selectedNature.code);
      } else {
        this.companyInfoForm.get('code')?.setValue('');
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.companyInfoForm.get(controlName);
    
    const fieldNames: { [key: string]: string } = {
        companyNameEN: "Company Name (English)",
        companyNameCN: "Company Name (Chinese)",
        companyType: "Company Type",
        natureofCompany: "Nature of Company",
        code: "Code",
        Flat_Address: "Flat Address",
        Building_Address: "Building Address",
        Street_Address: "Street Address",
        District_Address: "District Address",
        country_Address: "Country",
        company_Email: "Company Email",
        company_Telphone: "Company Telephone",
        company_Fax: "Company Fax",
        subscriptionDuration: "Subscription Duration",
        presentorName: "Presenter Name",
        presentorChiName: "Presenter Name (Chinese)",
        presentorAddress: "Presenter Address",
        presentorBuilding: "Presenter Building",
        presentorStreet: "Presenter Street",
        presentorDistrict: "Presenter District",
        presentorTel: "Presenter Telephone",
        presentorFax: "Presenter Fax",
        presentorEmail: "Presenter Email",
        presentorReferance: "Presenter Reference",
        companyLogo: "Company Logo"
    };

    const fieldLabel = fieldNames[controlName] || controlName;

    if (control?.touched || control?.dirty) {
        if (control?.hasError('required')) {
            return `${fieldLabel} is required.`;
        }
        if (control?.hasError('minlength')) {
            const minLength = control?.getError('minlength').requiredLength;
            return `${fieldLabel} must be at least ${minLength} characters long.`;
        }
        if (control?.hasError('email')) {
            return `Please enter a valid email address for ${fieldLabel}.`;
        }
        if (control?.hasError('pattern')) {
            return `${fieldLabel} must be exactly 10 digits long.`;
        }
    }
    return '';
}

  getErrorMessage1(controlName: string): string {
    const control = this.addShareForm.get(controlName);
  
    if (control?.touched || control?.dirty) { 
      if (control?.hasError('required')) {
        return `${controlName} is required.`;
      }
      if (control?.hasError('min')) {
        if (controlName === 'total_shares_proposed') {
          return 'At least 1 share must be proposed.';
        }
        if (controlName === 'unit_price') {
          return 'Unit price must be at least 0.';
        }
      }
    }
    return '';
  }

  getErrorMessage2(fieldName: string): string {
    const control = this.shareHoldersForm.get(fieldName);

    const fieldLabels: { [key: string]: string } = {
        surname: "Surname",
        name: "Name",
        chineeseName: "Chinese Name",
        idNo: "ID Number",
        idProof: "ID Proof",
        userType: "User Type",
        address: "Address",
        building: "Building",
        district: "District",
        street: "Street",
        addressProof: "Address Proof",
        email: "Email",
        phone: "Phone",
        shareDetailsNoOfShares: "Number of Shares",
        shareDetailsClassOfShares: "Class of Shares"
    };

    const fieldLabel = fieldLabels[fieldName] || fieldName;

    if (control?.errors && (control.dirty || control.touched)) {
        if (control.errors['required']) {
            return `${fieldLabel} is required.`;
        }
        if (control.errors['minlength']) {
            const minLength = control.getError('minlength').requiredLength;
            return `${fieldLabel} must be at least ${minLength} characters long.`;
        }
        if (control.errors['email']) {
            return `Please enter a valid email address.`;
        }
        if (control.errors['pattern']) {
            return `${fieldLabel} must be exactly 10 digits long.`;
        }
    }
    return '';
}

  
  changeTabShare(index: number) {

    if (!this.currentHolder || this.currentHolder.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Shareholders Added',
        text: 'Please add at least one shareholder before proceeding.',
        confirmButtonText: 'OK',
      });
      return; // Prevent changing the tab
    }

    this.activeTabIndex = index;
  
  }  
  // changeTab(index: number) {
  //   this.activeTabIndex = index;
  // }  
  // changeTab(index: number) {
  //   // Check if user can navigate to this tab
  //   if (this.canNavigateToTab(index)) {
  //     this.activeTabIndex = index;
  //     // Update URL with tab index without reloading
  //     this.updateUrlWithTab(index);
  //   }
  // }

  // Helper method to check if navigation is allowed
  canNavigateToTab(index: number): boolean {
    // console.log('Current Tab:', this.activeTabIndex, 'Target Tab:', index);
    
    // Restrict shareholders to only shareholder tab (index 1)
    if (this.userData.roles === 'Shareholder' && index !== 1) {
      return false;
    }
  
    // Restrict directors to only director tab (index 2)
    if (this.userData.roles === 'Director' && index !== 2) {
      return false;
    }
  
    // Special case: Going from Company tab (index 0) to Shareholder tab (index 1)
    if (this.activeTabIndex === 0 && index === 1) {
      return this.isCompanyFormCompleted(); // Require validation here
    }
  
    // Special case: Going from Shareholder to Director OR Director to Secretary
    if (this.activeTabIndex === 1 && index === 2) {
      
      return true; // No validation needed
    }
    
    if (this.activeTabIndex === 2 && index === 3) {
      return true; // No validation needed
    }
    
  
    // Allow navigation to previous tabs always
    if (index < this.activeTabIndex) {
      return true;
    }
  
    // For other cases, use the standard validation logic
    const completedForms = this.getCompletedForms();
    if (index === this.activeTabIndex + 1) {
      return completedForms[this.activeTabIndex];
    }
  
    return false;
  }
  
  // Add visited tabs tracking
  private visitedTabs: boolean[] = [false, false, false, false];
  
  // Update changeTab to mark tabs as visited
  changeTab(index: number) {
    if (this.canNavigateToTab(index)) {
      // Mark current tab as visited
      this.visitedTabs[this.activeTabIndex] = true;
      this.activeTabIndex = index;
      this.updateUrlWithTab(index);
    }
  }
  
  // New method to determine if a tab should show a checkmark
  isTabCompleted(index: number): boolean {
    // For shareholder and director tabs, they're "completed" if visited
    if ((index === 1 || index === 2) && this.visitedTabs[index]) {
      return true;
    }
    
    // For company and secretary tabs, use normal validation
    return this.getCompletedForms()[index];
  }
  // Helper method to track completed forms
  getCompletedForms(): boolean[] {
    return [
      this.isCompanyFormCompleted(),
      this.isShareholderFormCompleted(),
      this.isDirectorFormCompleted(),
      this.isSecretaryFormCompleted()
    ];
  }

  // Update URL without reloading page
  private updateUrlWithTab(index: number) {
    const url = this.router.createUrlTree([], {
      queryParams: { tab: index },
      queryParamsHandling: 'merge'
    });
    this.location.go(url.toString());
  }

  // Get tab index from URL
  private getTabIndexFromUrl(): number | null {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    return tab ? parseInt(tab) : null;
  }

  // Form completion check methods
  private isCompanyFormCompleted(): boolean {
   // console.log('this.shareHoldersForm?.valid || false',this.companyInfoForm?.value,this.companyInfoForm?.valid )
    return this.companyInfoForm?.valid || false;
  }

  private isShareholderFormCompleted(): boolean {
    // console.log('this.shareHoldersForm?.valid || false',this.shareHoldersForm?.value)
    return this.shareHoldersForm.valid || false;
  }

  private isDirectorFormCompleted(): boolean {
    return this.directorInformationForm.valid || false;
  }

  private isSecretaryFormCompleted(): boolean {
    return this.comapnySecretaryForm?.valid || false;
  }

  // Handle browser back button
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    const tabIndex = this.getTabIndexFromUrl();
    if (tabIndex !== null && this.canNavigateToTab(tabIndex)) {
      this.activeTabIndex = tabIndex;
    } else {
      // Prevent navigation if not allowed
      event.preventDefault();
    }
  }

  refreshShareDatas(){
    //this.shareCapitalList();
    this.getShareHoldersList()
  }
  
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      // Create a FileReader to read the image file as base64
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        console.log('base64 converted image link',this.imagePreview);
        
        this.companyInfoForm.patchValue({
          companyLogo: this.imagePreview 
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSaveAndNext(): void {
    console.log('companyInfoForm',this.companyInfoForm.value)
    if (this.companyInfoForm.valid) {
      this.submitCompanyInfo().subscribe({
        next: () => {
          this.changeTab(this.activeTabIndex + 1);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Form submitted successfully.",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        },
        error: () => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Form submission failed.",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
          console.warn("Form submission failed, staying on the same tab.");
        },
      });
    } else {
      this.companyInfoForm.markAllAsTouched();
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Form is invalid. Please fix the errors.",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      console.warn("Form is invalid. Please fix the errors before proceeding.");
    }
  }
  
  
  submitCompanyInfo(): Observable<boolean> {
    const formValues = this.companyInfoForm.getRawValue();
    console.log("Submitted form dataAAAAAA", formValues);
  
    return this.companyService.submitCompanyInfo(formValues).pipe(
      tap((response) => {
        console.log("Form submitted successfully", response);
        this.companyId=response.companyId
        console.log("Form submitted successfully", this.companyId);
        localStorage.setItem('companyId', this.companyId);
        Swal.fire({
          position: "top-end", 
          icon: "success",
          title: response.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });
        this.companyId = response.companyId;
      }),
      catchError((error) => {
        console.error("Error submitting form", error);
        Swal.fire({
          position: "top-end", 
          icon: "error",
          title: error.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });
        throw error;
      }),
      map(() => true)
    );
  }
  
  
  

  
  onNatureofCompany(event: Event) {
    console.log(event);
    // Optionally update your form value
    // this.companyInfoForm.patchValue({
    //   natureofCompany: event.value
    // });
  }

  initializeAddSharesForm(){
    this.addShareForm = this.fb.group({
      class_of_shares: ['', Validators.required],
      total_shares_proposed: ['', Validators.required],
      currency: ['HKD', Validators.required],
      unit_price: [null, [Validators.required, Validators.min(0)]],
      total_amount: [{ value: null, disabled: true }],
      total_capital_subscribed: ['', Validators.required],
      unpaid_amount: [{ value: 0, disabled: true }],
      particulars_of_rights: ['']
    })

    // Subscribe to changes in unit price and total shares to calculate total amount
    this.addShareForm.get('unit_price')?.valueChanges.subscribe(() => {
      this.calculateTotalAmount();
    });
  
    this.addShareForm.get('total_shares_proposed')?.valueChanges.subscribe(() => {
      this.calculateTotalAmount();
    });
  
    // Subscribe to changes in total amount and total capital subscribed to calculate unpaid amount
    this.addShareForm.get('total_amount')?.valueChanges.subscribe(() => {
      this.calculateUnpaidAmount();
    });
  
    this.addShareForm.get('total_capital_subscribed')?.valueChanges.subscribe(() => {
      this.calculateUnpaidAmount();
    });
  }

  calculateTotalAmount() {
    const unitPrice = this.addShareForm.get('unit_price')?.value;
    const totalShares = this.addShareForm.get('total_shares_proposed')?.value;

    if (unitPrice && totalShares) {
      const totalAmount = unitPrice * totalShares;
      this.addShareForm.get('total_amount')?.setValue(totalAmount.toFixed(2));
    }
  }

  calculateUnpaidAmount() {
    const totalAmount = parseFloat(this.addShareForm.get('total_amount')?.value) || 0;
    const totalCapitalSubscribed = parseFloat(this.addShareForm.get('total_capital_subscribed')?.value) || 0;
  
    const unpaidAmount = totalAmount - totalCapitalSubscribed;
    this.addShareForm.get('unpaid_amount')?.setValue(unpaidAmount >= 0 ? unpaidAmount.toFixed(2) : 0);
  }


  addSharesSubmit() {
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "User ID not found. Please log in again.",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      return;
    }
  
    const shareData = {
      companyId: this.companyId,
      userid: userId,
      total_shares_proposed: this.addShareForm.get('total_shares_proposed')?.value,
      unit_price: this.addShareForm.get('unit_price')?.value,
      total_capital_subscribed: this.addShareForm.get('total_capital_subscribed')?.value,
      unpaid_amount: this.addShareForm.get('unpaid_amount')?.value,
      class_of_shares: this.addShareForm.get('class_of_shares')?.value,
      particulars_of_rights: this.addShareForm.get('particulars_of_rights')?.value,
    };
  
    this.companyService.shareCreation(shareData).subscribe({
      next: (response) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: response.message,
          toast: true,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        this.getShareCapitalList();
        this.resetAddShareForm();
      },
      error: (error) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error",
          text: error.message || "Failed to create share.",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      },
    });
  }
  

resetAddShareForm() {
    this.addShareForm.reset({
        class_of_shares: '',
        total_shares_proposed: '',
        currency: 'HKD',  
        unit_price: null,
        total_amount: { value: null, disabled: true },
        total_capital_subscribed: '',
        unpaid_amount: { value: 0, disabled: true },
        particulars_of_rights: ''
    });

    this.addShareForm.get('total_amount')?.enable();
    this.addShareForm.get('unpaid_amount')?.enable();

    this.initializeAddSharesForm();
}




toggleShareHoldersForm() {
  console.log(this.showForm);
  
  this.showForm = !this.showForm; 
}

initializeSharesHoldersForm() {
 this.shareHoldersForm = this.fb.group({
    surname: ['', [Validators.required, Validators.minLength(3)]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    chineeseName: ['', [Validators.minLength(3)]],
    idNo: [''],
    idProof: ['', Validators.required],
    userType: ['person', Validators.required], 
    address: ['', [Validators.required, Validators.minLength(10)]],
    building: ['', Validators.minLength(4)],
    district: ['',Validators.minLength(4)],
    street: ['' ,Validators.minLength(4)],
    addressProof: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],

    phone: ['', [
      Validators.pattern(/^\d{10}$/) // Must be 10 digits if entered
    ]],

    shareDetailsNoOfShares: ['', Validators.required],
    shareDetailsClassOfShares: ['', Validators.required]
  });

  this.shareHoldersForm.get('userType')?.valueChanges.subscribe((userType) => {
    this.updateFormValidation(userType);
  });
}

updateFormValidation(userType: string) {
  const surnameControl = this.shareHoldersForm.get("surname");
  const chineseNameControl = this.shareHoldersForm.get("chineeseName");
  const idNoControl = this.shareHoldersForm.get("idNo");
  const addressProofControl = this.shareHoldersForm.get("addressProof");

  if (userType === "company") {
    surnameControl?.clearValidators();
    chineseNameControl?.clearValidators();
    this.shareHoldersForm.get("name")?.setValidators([Validators.required]);
    
    // Remove validation for address proof
    addressProofControl?.clearValidators();
  } else {
    surnameControl?.setValidators([Validators.required]);
    this.shareHoldersForm.get("name")?.setValidators([Validators.required]);

    // Restore validation for address proof
    addressProofControl?.setValidators([Validators.required]);
  }

  surnameControl?.updateValueAndValidity();
  idNoControl?.updateValueAndValidity();
  addressProofControl?.updateValueAndValidity(); // Ensure validation updates
}


shareHoldersFormSubmit() {
  console.log('this.shareHoldersForm.value',this.shareHoldersForm.value)

  // Mark all fields as touched to trigger validation messages
  Object.keys(this.shareHoldersForm.controls).forEach(key => {
    const control = this.shareHoldersForm.get(key);
    control?.markAsTouched();
  });

  if (this.shareHoldersForm.invalid) {
    // Optionally scroll to the first error
    const firstInvalidElement = document.querySelector('.error-message');
    firstInvalidElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  console.log('this.shareHoldersForm.value',this.shareHoldersForm.value)


  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole'); 
  if(!this.companyId){
    const savedCompanyId = localStorage.getItem('companyId');
  if (savedCompanyId) {
    this.companyId = savedCompanyId;
    console.log('found saved one',this.companyId);
    
  }
  }
  const formData = {
    ...this.shareHoldersForm.value,
    userId,
    companyId: this.companyId
  };
  console.log('this.shareHoldersForm.value',formData)

  this.companyService.shareHoldersCreation(formData).subscribe({
    next: (response) => {
      console.log('userRole',userRole);
      
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: response.message,
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      this.shareHoldersForm.reset();
      this.addressProofPreview = null;
      this.idProofPreview = null;
      this.currentHolder = formData;
      this.getShareHoldersList();
      if (userRole !== 'Company Secretary') {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Submission Successful!",
          text: "Redirecting to your dashboard...",
          toast: true,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.router.navigate(['/user-dashboard']); // Redirect
        });
      }
    },
    error: (error) => {
      console.error('Error occurred during share creation:', error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.message,
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  });
}


onImageSelectedAddress(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput?.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.addressProofPreview = reader.result as string; 
      console.log('Base64 address proof:', this.addressProofPreview);
      
      this.shareHoldersForm.patchValue({
        addressProof: this.addressProofPreview 
      });
    };
    reader.readAsDataURL(file);
  } else {
    this.addressProofPreview = null;
    this.shareHoldersForm.patchValue({ addressProof: null });
  }
}



onSelectIDProofImage(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput?.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.idProofPreview = reader.result as string;
      console.log('Base64 ID proof:', this.idProofPreview);
      
      this.shareHoldersForm.patchValue({
        idProof: this.idProofPreview 
      });
    };
    reader.readAsDataURL(file);
  } else {
    this.idProofPreview = null;
    this.shareHoldersForm.patchValue({ idProof: null });
  }
}



clearForm() {
  this.shareHoldersForm.reset();
}

getShareCapitalList() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "User ID not found. Please log in again.",
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    return;
  }

  this.companyService.getShareCapitalList(this.companyId, userId).subscribe({
    next: (response) => {
      console.log("Share capital list fetched successfully:", response);
      this.shareCapitalList = response.data;
      console.log("Share Capital List:", this.shareCapitalList); 
    },
    error: (error) => {
      console.error("Error fetching share capital list:", error);

      Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.error?.message || "Failed to fetch share capital list. Please try again later.",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    },
  });
}




editShareCapitalList(event:Event){
console.log(event);
}


deleteShareCapitalList(id: string) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      this.companyService.deleteShareCapital(id).subscribe({
        next: (response) => {
          console.log('Share capital deleted:', response.message);

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.message || 'Share capital deleted successfully!',
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });

          this.getShareCapitalList();
        },
        error: (error) => {
          console.error('Error deleting share capital:', error);

          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: error.message || 'Failed to delete share capital.',
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        },
      });
    }
  });
}




getShareHoldersList() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "User ID not found. Please log in again.",
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    return;
  }
  const savedCompanyId = localStorage.getItem('companyId');

  if (!savedCompanyId) {
    console.error("Company ID is missing in localStorage!");
    return;
  }

  // Ensure companyId is correctly set before adding it to formData
  this.companyId = savedCompanyId; 
  console.log('this.companyId ',this.companyId );
  

  this.companyService.getShareHoldersList(this.companyId, userId).subscribe({
    next: (response) => {
      this.shareholders = response.data;
      console.log('shareeeethis.shareholders',this.shareholders);
      
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Shareholders list fetched successfully.",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    },
    error: (error) => {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: error.message || "Failed to fetch shareholders list.",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    },
  });
}


invateShareHoldersButton(){
  this.invateShareHolderForm=!this.invateShareHolderForm
}

generateSecurePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';  // Excluding I and O to avoid confusion
  const lowercase = 'abcdefghijkmnpqrstuvwxyz';  // Excluding l and o to avoid confusion
  const numbers = '23456789';  // Excluding 0 and 1 to avoid confusion
  
  const allChars = uppercase + lowercase + numbers;
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  
  // Fill the rest of the password
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}


initializeInvateSharesHoldersForm(){
  this.inviteShareholderForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: [''],
    classOfShares: ['Ordinary', Validators.required],
    noOfShares: ['', Validators.required],
  });
}

invateShareHoldersSubmit() {
  if (this.inviteShareholderForm.invalid) {
    this.inviteShareholderForm.markAllAsTouched(); 
    return; 
  }

  const userId = localStorage.getItem('userId');
  const savedCompanyId = localStorage.getItem('companyId');

  if (!savedCompanyId) {
    console.error("Company ID is missing in localStorage!");
    return;
  }

  // Ensure companyId is correctly set before adding it to formData
  this.companyId = savedCompanyId; 

  const formData = {
    ...this.inviteShareholderForm.value,
    password:this.generateSecurePassword(),
    userId: userId, 
    companyId: this.companyId
  };

  console.log(formData);
  
  this.companyService.InvateshareHoldersCreation(formData).subscribe({
    next: (response) => {
      console.log('Shareholder invitation successful:', response.message);
      
      Swal.fire({
        position: "top-end", 
        icon: 'success',
        title: 'Invitation Sent!',
        toast: true, 
        text: `The invitation to ${formData.name} has been sent successfully!`,
        showConfirmButton:false,
        timer: 2000, 
        timerProgressBar: true, 
      });

      this.inviteShareholderForm.reset();
      this.addressProofPreview = null;
      this.idProofPreview = null;
      this.getShareHoldersList();
    },
    error: (error) => {
      console.error('Error occurred during share creation:', error);

       Swal.fire({
          position: "top-end", 
          icon: "error",
          title: error.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });
    }
  });
}


clearInvateShareHoldersForm(){
  this.inviteShareholderForm.reset()
}

getErrorMessage3(controlName: string): string {
  const control = this.inviteShareholderForm.get(controlName);

  if (control?.touched || control?.dirty) { 
    if (control?.hasError('required')) {
      return `${controlName} is required.`;
    }
  }
  return '';
}

directorsInfoFormOpen(){
  this.directorsInfoOpen = !this.directorsInfoOpen
}



initializeDirectorInfoForm() {
  this.directorInformationForm = this.fb.group({
    type: ["person", Validators.required],
    surname: ["", [Validators.required, Validators.minLength(4)]],
    name: ["", [Validators.required, Validators.minLength(4)]],
    chineeseName: ["",Validators.minLength(4)],
    idNo: [""],
    idProof: [null, Validators.required],

    address: ["", [Validators.required, Validators.minLength(10)]],
    street: ["", Validators.minLength(4)],
    building: ["", Validators.minLength(4)],
    district: ["", Validators.minLength(4)],
    addressProof: [null, Validators.required],

    email: ["", [Validators.required, Validators.email]],
    
    phone: ["", [
      Validators.pattern(/^\d{10}$/) // Must be 10 digits if entered
    ]],
  });

  this.directorInformationForm.get("type")?.valueChanges.subscribe((type) => {
    this.updateFormValidation1(type)
  })
}

updateFormValidation1(type: string) {
  const surnameControl = this.directorInformationForm.get("surname");
  const chineseNameControl = this.directorInformationForm.get("chineeseName");
  const idNoControl = this.directorInformationForm.get("idNo");
  const addressProofControl = this.directorInformationForm.get("addressProof");

  if (type === "company") {
    surnameControl?.clearValidators();
    chineseNameControl?.clearValidators();
    this.directorInformationForm.get("name")?.setValidators([Validators.required]);
    
    // Remove validation for address proof
    addressProofControl?.clearValidators();
  } else {
    surnameControl?.setValidators([Validators.required]);
    this.directorInformationForm.get("name")?.setValidators([Validators.required]);

    // Restore validation for address proof
    addressProofControl?.setValidators([Validators.required]);
  }

  surnameControl?.updateValueAndValidity();
  idNoControl?.updateValueAndValidity();
  addressProofControl?.updateValueAndValidity(); // Ensure validation updates
}



getErrorMessage4(controlName: string): string {
  const control = this.directorInformationForm.get(controlName);
  
  if (control?.errors && (control.dirty || control.touched)) {
    // Format the control name for display
    const formattedName = controlName
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
    
    if (control.errors['required']) {
      return `${formattedName} is required`;
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (control.errors['pattern']) {
      return `Invalid ${formattedName.toLowerCase()} format`;
    }
    if (control.errors['minlength']) {
      return `${formattedName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
  }
  return '';
}

imagePreviewOnDirectorsIDProof(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.imagePreviewDirectorsId = e.target?.result as string | ArrayBuffer |null; 
    };

    reader.onloadend = () => {
      const result = reader.result; 
      if (typeof result === 'string') {
        this.directorInformationForm.patchValue({
          idProof: result, 
        });
        console.log('Base64 String:', result);
      } else {
        console.error('Result is not a string:', result); 
      }
    };

    reader.readAsDataURL(file);
  }
}


imagePreviewOnDirectorsAddressProof(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput?.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64AddressProof = reader.result as string;
      console.log('Base64 address proof:', base64AddressProof);


      this.addressProofDirectors = base64AddressProof; 
    };

    reader.readAsDataURL(file);
  } else {
    this.addressProofDirectors = null; 
  }
}




directorFormSubmission() {
  // Mark all fields as touched to trigger validation messages
  Object.keys(this.directorInformationForm.controls).forEach(key => {
    const control = this.directorInformationForm.get(key);
    control?.markAsTouched();
  });

  if (this.directorInformationForm.invalid) {
    // Scroll to first error message
    const firstInvalidElement = document.querySelector('.error-message');
    if (firstInvalidElement) {
      firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');
  const companyId = this.companyId;

  const formData = {
    ...this.directorInformationForm.value,
    addressProof: this.addressProofDirectors,
    userId: userId,
    companyId: companyId
  };

  console.log('Submitting director form data:', formData);

  this.companyService.DirectorInfoCreation(formData).subscribe({
    next: (response) => {
      console.log('Director creation successful:', response.message);
      
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: response.message,
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // Reset form and clear previews
      this.directorInformationForm.reset();
      this.fetchDirectorsInfo();
      this.imagePreviewDirectorsAddressProof = null;
      this.imagePreviewDirectorsId = null;
      if (userRole !== 'Company Secretary') {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Submission Successful!",
          text: "Redirecting to your dashboard...",
          toast: true,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.router.navigate(['/user-dashboard']); // Redirect
        });
      }
    },
    error: (error) => {
      console.error('Error occurred during director information creation:', error);

      Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.message || 'An error occurred while creating director information',
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  });
}

fetchDirectorsInfo(): void {
  const userId = localStorage.getItem('userId');
  const companyId = this.companyId;

  if (!userId) {
    console.error('Error: User ID is not found in localStorage');
    return;
  }

  this.companyService.getDirectorsInfo(companyId, userId).subscribe({
    next: (response) => {
      this.directorsInformation = response.data;
    },
    error: (err) => {
      console.error('Error fetching directors info:', err.message);
    },
  });
}

OnDeleteDirectorInfo(directorId: string): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      this.companyService.deleteDirector(directorId).subscribe({
        next: (response) => {
          console.log('Director deleted successfully:', response);
          this.directorsInformation = this.directorsInformation.filter(
            (director) => director._id !== directorId
          );

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'The director has been deleted.',
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        },
        error: (error) => {
          console.error('Error deleting director:', error.message);

          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Failed to delete the director. Please try again.',
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        },
      });
    }
  });
}


openDirectorInvateForm(){
  this.directorInvateOpen = !this.directorInvateOpen
}


initializeInvateDirectorForm(){
  this.InviteDirectorsForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    classOfShares: [''],
    noOfShares: [''],
  });
}

getErrorMessage5(controlName: string): string {
  const control = this.InviteDirectorsForm.get(controlName);
  if (control && (control.touched || control.dirty)) {
  if (control?.hasError('required')) {
    return `${controlName} is required`;
  }
  if (control?.hasError('email')) {
    return 'Enter a valid email address';
  }
  if (control?.hasError('minlength')) {
    return `Minimum length is 3 characters`;
  }
  if (control?.hasError('min')) {
    return `Value must be greater than 0`;
  }
}
  return '';
}

invateDirectorSubmit(): void {
  Object.keys(this.InviteDirectorsForm.controls).forEach(key => {
    const control = this.InviteDirectorsForm.get(key);
    control?.markAsTouched();
  });
  if (this.InviteDirectorsForm.valid) {
    const userId = localStorage.getItem("userId");
    const companyId = this.companyId;
    const formData = this.InviteDirectorsForm.value;

    const data = {
      ...formData,
      userId: userId,
      companyId: companyId,
      password:this.generateSecurePassword()
    };

    this.companyService.directorInviteCreation(data).subscribe({
      next: (response) => {
        console.log('director creation created',response);
        
        Swal.fire({
          position: "top-end", 
          icon: "success",
          title: "Invitation Sent!",
          toast: true, 
          text: `The invitation to ${formData.name} has been sent successfully!`,
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true,
        });

        this.InviteDirectorsForm.reset();
      },
      error: (error) => {
        Swal.fire({
          position: "top-end", 
          icon: "error",
          title: error.message || "Failed to send invitation email.", 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });
      },
    });
  } else {
    console.log("Form is invalid");
  }
}


initializeCompanySecretaryForm() {
    this.comapnySecretaryForm = this.fb.group({
      tcspLicenseNo: ["", [Validators.required]],
      tcspReason: [""],
      type: ["person", Validators.required],
      surname: ["",Validators.required],
      name: ["", [Validators.required]],
      chineeseName: [""],
      idNo: [""],
      idProof: ["", [Validators.required]],
      address: ["", [Validators.required,,Validators.minLength(8)]],
      street: ["",Validators.minLength(4)],
      building: ["",Validators.minLength(4)],
      district: ["",Validators.minLength(4)],
      addressProof: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: [""],
    })
    this.comapnySecretaryForm.get("type")?.valueChanges.subscribe((type) => {
      this.updateFormValidation3(type)
    })
  }

  updateFormValidation3(type: string) {
    const surnameControl = this.comapnySecretaryForm.get("surname");
    const idNoControl = this.comapnySecretaryForm.get("idNo");
    const addressProofControl = this.comapnySecretaryForm.get("addressProof");
  
    if (type === "company") {
      surnameControl?.clearValidators();
      addressProofControl?.clearValidators(); // Remove validation for address proof
    } else {
      surnameControl?.setValidators([Validators.required]);
      addressProofControl?.setValidators([Validators.required]); // Restore validation for address proof
    }
  
    surnameControl?.updateValueAndValidity();
    idNoControl?.updateValueAndValidity();
    addressProofControl?.updateValueAndValidity(); // Ensure validation updates
  }
  





comapnySecretarySubmission(){
  console.log(this.comapnySecretaryForm.value);
  Object.keys(this.comapnySecretaryForm.controls).forEach(key => {
    const control = this.comapnySecretaryForm.get(key);
    control?.markAsTouched();
  });

  if (this.comapnySecretaryForm.invalid) {
    this.comapnySecretaryForm.markAllAsTouched(); 
    return; 
  }

  const userId = localStorage.getItem('userId');
  const companyId = this.companyId;

  const formData = {
    ...this.comapnySecretaryForm.value,
    addressProof:this.imagePreviewCompanySecretaryAddressProof,
    userId: userId, 
    companyId: companyId
  };

  console.log(formData);
  
  this.companyService.companySecretaryCreation(formData).subscribe({
    next: (response) => {
      console.log('Company Secretary information successfully added:', response.message);
      
      Swal.fire({
          position: "top-end", 
          icon: "success",
          title: response.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });

      this.comapnySecretaryForm.reset();
      this.router.navigate(['/summary', companyId]); 
      this.imagePreviewCompanySecretaryAddressProof = null;
      this.imagePreviewCompanySecretaryId = null;
    },
    error: (error) => {
      console.error('Error occurred during company Secretary information creation:', error);

       Swal.fire({
          position: "top-end", 
          icon: "error",
          title: error.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });
    }
  });
}


imagePreviewOnCompanySecretaryIDProof(event:Event){
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.imagePreviewCompanySecretaryId = e.target?.result as string | ArrayBuffer |null; 
    };

    reader.onloadend = () => {
      const result = reader.result; 
      if (typeof result === 'string') {
        this.comapnySecretaryForm.patchValue({
          idProof: result, 
        });
        console.log('Base64 String:', result);
      } else {
        console.error('Result is not a string:', result); 
      }
    };

    reader.readAsDataURL(file);
  }
}

getErrorMessage6(controlName: string): string {
  const control = this.comapnySecretaryForm.get(controlName);

  const fieldNames: { [key: string]: string } = {
    tcspLicenseNo: 'TCSP License Number',
    tcspReason: 'TCSP Reason',
    type: 'Type',
    surname: 'Surname',
    name: 'Name',
    chineeseName: 'Chinese Name',
    idProof: 'ID Proof',
    address: 'Address',
    street: 'Street',
    building: 'Building',
    district: 'District',
    addressProof: 'Address Proof',
    email: 'Email',
    phone: 'Phone',
  };

  const fieldLabel = fieldNames[controlName] || controlName;

  if (control?.errors && (control.touched || control.dirty)) {
    if (control.hasError('required')) {
      return `${fieldLabel} is required.`;
    }
    if (control.hasError('minlength')) {
      return `${fieldLabel} must be at least ${control.getError('minlength').requiredLength} characters long.`;
    }
    if (control.hasError('email')) {
      return 'Enter a valid email address.';
    }
    if (control.hasError('pattern')) {
      return `${fieldLabel} must be exactly 10 digits long.`;
    }
  }
  return '';
}



imagePreviewOnCompanySecretaryAddressProof(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput?.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64AddressProof = reader.result as string;
      console.log('Base64 address proof:', base64AddressProof);


      this.imagePreviewCompanySecretaryAddressProof = base64AddressProof; 
    };

    reader.readAsDataURL(file);
  } else {
    this.imagePreviewCompanySecretaryAddressProof = null; 
  }
}

}

