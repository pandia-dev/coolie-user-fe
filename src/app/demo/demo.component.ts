import { Component, ElementRef, ViewChild } from '@angular/core';
import { DemoService } from '../demo.service';
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {

  @ViewChild('containerRef') containerRef: ElementRef | undefined;

  public categoryData: any[] = [];
  public selectedCategoryIdLocal: number | null = null;
  private readonly tabWidth = 200; // Width of each tab
  private readonly visibleTabs = 5; // Number of tabs visible at once
  private readonly buttonWidth = 70; // Width of the arrow buttons

  public albums = [
    {
      name: 'Album 1',
      videos: [
        { title: 'Video 1-1', url: 'assets/videos/CoolieNo1User - Google Chrome 2024-07-29 12-17-23.mp4' },
        { title: 'Video 1-2', url: 'assets/videos/test-relationship.mp4' },
        { title: 'Video 1-3', url: 'assets/videos/fb-f-band-i-gdown.mp4' },
      ]
    },
    {
      name: 'Album 2',
      videos: [
        { title: 'Video 2-1', url: 'assets/videos/exam-mr-bean.mp4' },
        { title: 'Video 2-2', url: 'assets/videos/fb-f-band-i-gdown.mp4' },
        { title: 'Video 2-3', url: 'assets/videos/test-relationship.mp4' },
      ]
    },
    {
      name: 'Album 3',
      videos: [
        { title: 'Video 3-1', url: 'assets/videos/fb-f-band-i-gdown.mp4' },
        { title: 'Video 3-2', url: 'assets/videos/test-relationship.mp4' },
        { title: 'Video 3-3', url: 'assets/videos/exam-mr-bean.mp4' },
      ]
    },
    {
      name: 'Album 4',
      videos: [
        { title: 'Video 4-1', url: 'assets/videos/fb-f-band-i-gdown.mp4' },
        { title: 'Video 4-2', url: 'assets/videos/test-relationship.mp4' },
        { title: 'Video 4-3', url: 'assets/videos/exam-mr-bean.mp4' },
      ]
    }
  ]; selectedAlbumIndex: number | null = null;
  private selectedVideoIndex: number | null = null;
  public videoProgress: number[] = [];

  constructor(private readonly categoryService: DemoService) { }

  ngOnInit(): void {
    this.categoryService.getCategoryData().subscribe(
      data => this.categoryData = [...data, ...data, ...data], // Cloning the list for circular scrolling
      (error: any) => console.error('Error fetching category data', error)
    );
  }

  handleCategoryClick(id: number): void {
    this.categoryService.setSelectedCategoryId(id);
    this.selectedCategoryIdLocal = id;
    this.scrollToSelectedTab(id);
  }

  scrollToSelectedTab(id: number): void {
    if (this.containerRef) {
      const selectedTab = document.getElementById(`tab-${id}`);
      if (selectedTab) {
        const tabLeftPosition = selectedTab.offsetLeft;
        this.containerRef.nativeElement.scrollTo({
          left: tabLeftPosition - this.buttonWidth,
          behavior: 'smooth'
        });
      }
    }
  }

  scrollLeft(): void {
    if (this.containerRef) {
      this.containerRef.nativeElement.scrollBy({
        left: -this.tabWidth * this.visibleTabs,
        behavior: 'smooth'
      });
      setTimeout(() => {
        // if (this.containerRef.nativeElement.scrollLeft === 0) {
        //   this.containerRef.nativeElement.scrollTo({
        //     left: this.containerRef.nativeElement.scrollWidth / 3,
        //     behavior: 'instant'
        //   });
        // }
      }, 500);
    }
  }

  scrollRight(): void {
    if (this.containerRef) {
      this.containerRef.nativeElement.scrollBy({
        left: this.tabWidth * this.visibleTabs,
        behavior: 'smooth'
      });
      //     setTimeout(() => {
      //       if (
      //         this.containerRef.nativeElement.scrollLeft >=
      //         this.containerRef.nativeElement.scrollWidth - this.containerRef.nativeElement.clientWidth
      //       ) {
      //         this.containerRef.nativeElement.scrollTo({
      //           left: this.containerRef.nativeElement.scrollWidth / 3,
      //           behavior: 'instant'
      //         });
      //       }
      //     }, 500);
      //   }
      // }
    }
  }

  selectAlbum(albumIndex: number, videoIndex: number): void {
    this.selectedAlbumIndex = albumIndex;
    this.selectedVideoIndex = videoIndex;
    this.videoProgress = Array(this.albums[albumIndex].videos.length).fill(0);
  }

  get currentVideoUrl(): string | null {
    if (this.selectedAlbumIndex !== null && this.selectedVideoIndex !== null) {
      return this.albums[this.selectedAlbumIndex].videos[this.selectedVideoIndex].url;
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
    if (
      this.selectedVideoIndex !== null &&
      this.selectedAlbumIndex !== null &&
      this.selectedVideoIndex < this.albums[this.selectedAlbumIndex].videos.length - 1
    ) {
      this.selectedVideoIndex++;
    } else {
      this.closeVideo();
    }
  }

  closeVideo(): void {
    this.selectedAlbumIndex = null;
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
      this.videoProgress[this.selectedVideoIndex] = (videoElement.currentTime / videoElement.duration) * 100;
    }
  }

  onVideoEnded(): void {
    this.playNextVideo(); // Automatically play the next video
  }
}
