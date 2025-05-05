  import { Component } from '@angular/core';
  import { FormGroup, FormControl, Validators, ValidationErrors, ReactiveFormsModule, AbstractControl } from '@angular/forms';
  import { Router, RouterModule } from '@angular/router';

  @Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule,RouterModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
  })
  export class RegisterComponent {
    isSubmitted = false;
    showPassword = false;
    showConfirmPassword = false;
    protected images: string[] = [
      "https://media.themoviedb.org/t/p/w440_and_h660_face/vxMeUZ46wMYijcPSYxPCrD1ZHgx.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/xazWoLealQwEgqZ89MLZklLZD3k.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/qkhP3bhxQQjs1bGEWNts64DOUkK.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/7uoiKOEjxBBW0AgDGQWrlfGQ90w.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/esmAU0fCO28FbS6bUBKLAzJrohZ.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/b089YkBDJjOGDQxXkOXBR06Lz2Y.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/aQvJ5WPzZgYVDrxLX4R6cLJCEaQ.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/4Kru90S3N0v8cEqlfehmDgvsF1h.jpg",

      "https://media.themoviedb.org/t/p/w440_and_h660_face/imKSymKBK7o73sajciEmndJoVkR.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/AdpcyHDrwxUuBi6OCSvNbAmRLKK.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/w9XQ7ehwaxqV6WJSAUE0qLTQHgq.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/8E7mIpEpSATxX5JEuw55GYx9hfk.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/mWRQNlWXYYfd2z4FRm99MsgHgiA.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/d6LbJZO8ruvXgOjjGRgjtdYpJS4.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/l9iqhOWTP33HgWuxOZTLlYLZ58f.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/bDohw4b035IOJ9SPaw9lpNhZMyB.jpg",

      "https://media.themoviedb.org/t/p/w440_and_h660_face/sR1Wh1rNQCrGr6Qs47DCdXxEC0S.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/7uoiKOEjxBBW0AgDGQWrlfGQ90w.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/iXVaWbxmyPk4KZGZk5GGDGFieMX.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/neZ0ykEsPqxamsX6o5QNUFILQrz.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/aQvJ5WPzZgYVDrxLX4R6cLJCEaQ.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/lPzomd8YmtfjPguP8LKRz9q27WV.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/qjlbN6aK1qgeg3SspFVovT2D1Me.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/mFvoEwSfLqbcWwFsDjQebn9bzFe.jpg",
      "https://media.themoviedb.org/t/p/w440_and_h660_face/vGYJRor3pCyjbaCpJKC39MpJhIT.jpg",
    ];

    constructor(private router: Router) {}

    // Initialize form with validators
    registrationForm = new FormGroup({
      fullname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
      termsAgreed: new FormControl(false, [Validators.requiredTrue])
    }, {
      validators: this.passwordMatchValidator
    });


    // Custom validator to check if passwords match
    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');

      // Return null if either control is invalid or passwords match
      if (!password || !confirmPassword) return null;
      if (password.value === confirmPassword.value) return null;

      // Return error if passwords don't match
      return { passwordMismatch: true };
    }

    // Toggle password visibility
    togglePasswordVisibility(field: string): void {
      if (field === 'password') {
        this.showPassword = !this.showPassword;
      } else {
        this.showConfirmPassword = !this.showConfirmPassword;
      }
    }

    // Form submission handler
    onSubmit(): void {
      this.isSubmitted = true;

      if (this.registrationForm.valid) {
        console.log('Registration form submitted successfully');
        console.log(this.registrationForm.value);


        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      } else {

      }
    }
  }
