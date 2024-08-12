import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { FotterComponent } from '../fotter/fotter.component';
import { UserDetailsService } from '../user-details.service';
import { BookingsService } from '../bookings.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild('footer') footer!: FotterComponent;
  constructor(
    private readonly router: Router,
    private readonly servicesService: ServiceService,
    private readonly authentication: AuthenticationService,
    private readonly bookingService: BookingsService,

    private readonly userDetailsService: UserDetailsService
  ) {
    // this.router.navigate(['auth'])
    this.getService();
  }

  ngOnInit(): void {
    this.getMostBookedservices();
    this.getUser();
    setTimeout(() => {
      this.getCoreService();
    }, 1000);
    this.getReels();
  }
  public ads = [
    {
      src: '/assets/ads/ads.png',
    },
    {
      src: '/assets/ads/ads.png',
    },
    {
      src: '/assets/ads/ads.png',
    },
    {
      src: '/assets/ads/ads.png',
    },
  ];
  public service: any;

  public mostBooked: any;

  public covered: any = [
    {
      image: 'assets/demo/cutting.png',
      tittle: 'Expert haircut starting at Rs.199 ',
      description: 'Haircut at home',
      backgroundColor: '#0073C3',
    },
    {
      image: 'assets/demo/massage.png',
      tittle: 'Relax & rejuvenateat home',
      description: 'Massage for men',
      backgroundColor: '#8D9E2B',
    },
    {
      image: 'assets/demo/Rectangle 3395.png',
      tittle: 'Get experts in 2hours at Rs.149',
      description: 'Electricians, Plumbers, Carpenter',
      backgroundColor: '#0073C3',
    },
    {
      image: 'assets/home/bridal.png',
      tittle: 'Bridal makeup at your convenience',
      description: 'Bridal makeup services',
      backgroundColor: '#A62420',
    },
    {
      image: 'assets/home/garden.png',
      tittle: 'Beautiful garden all year around',
      description: 'Gardening services',
      backgroundColor: '#8D9E2B',
    },
    {
      image: 'assets/home/kitchen.png',
      tittle: 'Maintain your kitchen with ease',
      description: 'Kitchen maintenance service',
      backgroundColor: '#8D9E2B',
    },
  ];

  getService() {
    this.servicesService.getService().subscribe(
      (response) => {
        console.log(response);
        this.service = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  selectedCategory(id: any, index: any) {
    this.servicesService.readyToGetSubCategory(id, index);
    this.router.navigate(['subServices']);
  }

  getMostBookedservices() {
    this.servicesService.getMostBooked().subscribe((response) => {
      console.log(response);
      this.mostBooked = response;
    });
  }

  // get core service

  coreServices: any[] = [];
  getCoreService() {
    this.servicesService.getCoreService().subscribe({
      next: (response) => {
        console.log(response);
        this.coreServices = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // getting reels
  // Component Code
  albums: { _id: string; videoUrl: string }[] = [];
  selectedVideoIndex: number | null = null;
  videoProgress: number[] = [];

  getReels() {
    this.servicesService.getReels().subscribe({
      next: (response) => {
        console.log(response);
        this.albums = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  selectAlbum(videoIndex: number): void {
    this.selectedVideoIndex = videoIndex;
    this.videoProgress = Array(this.albums.length).fill(0);
  }

  get currentVideoUrl(): string | null {
    if (this.selectedVideoIndex !== null && this.albums.length !== 0) {
      return this.albums[this.selectedVideoIndex].videoUrl;
    }
    return null;
  }

  playPreviousVideo(): void {
    if (this.selectedVideoIndex !== null && this.selectedVideoIndex > 0) {
      this.selectedVideoIndex--;
    } else {
      this.closeVideo();
    }
  }

  playNextVideo(): void {
    if (this.selectedVideoIndex !== null) {
      // Complete the progress of the current video before moving to the next one
      this.videoProgress[this.selectedVideoIndex] = 100;

      if (this.selectedVideoIndex < this.albums.length - 1) {
        this.selectedVideoIndex++;
      } else {
        this.closeVideo();
      }
    }
  }

  closeVideo(): void {
    this.selectedVideoIndex = null;
    this.videoProgress = [];
  }

  onVideoClick(event: MouseEvent): void {
    const videoElement = event.target as HTMLElement;
    const clickX = event.clientX;
    const videoWidth = videoElement.offsetWidth;

    if (clickX < videoWidth / 2) {
      this.playPreviousVideo();
    } else {
      this.playNextVideo();
    }
  }

  onTimeUpdate(event: Event): void {
    const videoElement = event.target as HTMLVideoElement;
    if (this.selectedVideoIndex !== null) {
      this.videoProgress[this.selectedVideoIndex] =
        (videoElement.currentTime / videoElement.duration) * 100;
    }
  }

  onVideoEnded(): void {
    this.playNextVideo(); // Automatically play the next video
  }

  getUser() {
    this.authentication.getUser().subscribe(
      (response) => {
        console.log(response);
        this.userDetailsService.userDetailsFromGoogle = response;
        this.bookingService.name = response.displayName;
        this.bookingService.phoneNumber = response.phone;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // navigations starts from here------>
  navToMainService() {
    this.router.navigate(['mainService']);
  }
}
