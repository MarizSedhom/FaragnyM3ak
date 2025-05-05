import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as noUiSlider from 'nouislider';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayer {
  getPlayerState?: () => number;
  playVideo?: () => void;
  pauseVideo?: () => void;
  seekTo?: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime?: () => number;
  getDuration?: () => number;
  getVolume?: () => number;
  setVolume?: (volume: number) => void;
  isMuted?: () => boolean;
  mute?: () => void;
  unMute?: () => void;
  loadVideoById?: (videoId: string) => void;
  destroy?: () => void;
}

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WatchComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private route: ActivatedRoute, private router: Router) {
    this.watchID = route.snapshot.paramMap.get('watchid') || this.episodeList[0].watchID;
  }

  // YouTube player instance with proper typing
  player: YouTubePlayer | null = null;
  playerLoading = true;
  playerReady = false;

  // Component state and references
  isFullscreen = false;
  HideControlsEvent: any;
  SliderUpdateEvent: any;
  lastClick = 0;
  watchID: string | null;

  // ViewChild references
  @ViewChild('watchSection') watchSection!: ElementRef<HTMLDivElement>;
  @ViewChild('controlsWrapper') controlSection!: ElementRef<HTMLDivElement>;
  @ViewChild('playBTN') playBTN!: ElementRef<HTMLButtonElement>;
  @ViewChild('slider') slider!: ElementRef<HTMLDivElement>;
  @ViewChild('videoOverlay') overlay!: ElementRef<HTMLDivElement>;
  @ViewChild('leftOverlay') leftOverlay!: ElementRef<HTMLDivElement>;
  @ViewChild('rightOverlay') rightOverlay!: ElementRef<HTMLDivElement>;
  @ViewChild('centerOverlay') centerOverlay!: ElementRef<HTMLDivElement>;
  @ViewChild('volumeSlider') volSlider!: ElementRef<HTMLDivElement>;
  @ViewChild('swiperContainer') swiper!: ElementRef<SwiperContainer>;

  ngAfterViewInit() {
    // Register and initialize Swiper
    register();
    const swiperEl = this.swiper.nativeElement as any;

    Object.assign(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 10,
      scrollbar: {
        draggable: true,
        snapOnRelease: false
      },
      breakpoints: {
        780: { slidesPerView: 2, spaceBetween: 20 },
        1100: { slidesPerView: 3, spaceBetween: 30 }
      }
    });

    swiperEl.initialize();
  }

  // Keyboard control handler
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.playerReady) return;

    switch (event.key) {
      case ' ': event.preventDefault(); this.playVideo(); break;
      case 'ArrowLeft': this.seekBack(); break;
      case 'ArrowRight': this.seekAhead(); break;
      case 'ArrowUp':
        if (this.isPlaying()) {
          event.preventDefault();
          this.changeVolume(5);
        }
        break;
      case 'ArrowDown':
        if (this.isPlaying()) {
          event.preventDefault();
          this.changeVolume(-5);
        }
        break;
      case 'm': case 'M': this.toggleMute(); break;
      case 'f': case 'F': this.toggleFullScreen(); break;
    }
  }

  ngOnInit(): void {
    // Load and initialize YouTube player and UI interactions
    this.loadYouTubeAPI().then(() => {
      this.initPlayer();

      // Double-tap/double-click handlers for seek and full screen
      this.leftOverlay.nativeElement.addEventListener('dblclick', () => {
        this.seekBack();
        this.dynamicShowControl();
      });

      this.rightOverlay.nativeElement.addEventListener('dblclick', () => {
        this.seekAhead();
        this.dynamicShowControl();
      });

      this.centerOverlay.nativeElement.addEventListener('dblclick', () => {
        this.toggleFullScreen();
      });

      // Tap and mouse interactions
      this.setupTouchListeners();
    }).catch(error => {
      console.error('Failed to initialize YouTube player:', error);
      this.playerLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.player?.destroy?.();
    clearTimeout(this.HideControlsEvent);
    clearInterval(this.SliderUpdateEvent);
  }

  // Load YouTube API dynamically
  private loadYouTubeAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.onerror = () => reject(new Error('Failed to load YouTube API'));
        document.body.appendChild(script);
        window.onYouTubeIframeAPIReady = () => resolve();
      }
    });
  }

  // Initialize YouTube Player
  private initPlayer(): void {
    try {
      this.player = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: this.watchID,
        playerVars: {
          controls: 0,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          iv_load_policy: 3,
          autoplay: 1,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            this.playerReady = true;
            this.playerLoading = false;
            this.onPlayerReady();
          },
          onStateChange: () => {
            if (this.isPlaying()) {
              this.dynamicShowControl();
            } else {
              this.showControls();
            }
          },
          onError: (event: any) => {
            console.error('YouTube Player Error:', event);
            this.playerLoading = false;
          }
        }
      });
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
      this.playerLoading = false;
    }
  }

  private onPlayerReady(): void {
    if (!this.playerReady) return;

    // Create playback slider
    noUiSlider.create(this.slider.nativeElement, {
      start: [this.getCurrentTime()],
      connect: [true, false],
      range: { min: 0, max: this.getDuration() },
      step: 1,
      tooltips: false,
      format: { to: (v) => v, from: (v) => Number(v) }
    });

    // Create volume slider
    noUiSlider.create(this.volSlider.nativeElement, {
      start: [this.player?.getVolume?.() || 50],
      connect: [true, false],
      range: { min: 0, max: 100 },
      step: 1,
      tooltips: false,
      format: { to: (v) => v, from: (v) => Number(v) }
    });

    const sliderElement = this.slider.nativeElement as noUiSlider.target;
    const volSliderElement = this.volSlider.nativeElement as noUiSlider.target;

    volSliderElement.noUiSlider?.on('change', (values: any) => {
      if (this.playerReady) {
        this.player?.setVolume?.(values[0]);
      }
    });

    this.startSliderInterval();

    sliderElement.noUiSlider?.on('change', (values: any) => {
      this.stopSliderInterval();
      if (this.playerReady) {
        this.player?.seekTo?.(values[0], true);
      }
    });

    sliderElement.noUiSlider?.on('slide', (values: any) => {
      this.stopSliderInterval();
      if (this.playerReady) {
        this.player?.seekTo?.(values[0], false);
      }
    });
  }

  // Safe player methods
  isPlaying(): boolean {
    return this.playerReady && this.player?.getPlayerState?.() === 1;
  }

  getCurrentTime(): number {
    return this.playerReady ? this.player?.getCurrentTime?.() || 0 : 0;
  }

  getDuration(): number {
    return this.playerReady ? this.player?.getDuration?.() || 0 : 0;
  }

  // Toggle play/pause
  playVideo(): void {
    if (!this.playerReady) return;

    switch (this.player?.getPlayerState?.()) {
      case 1: 
        this.player?.pauseVideo?.(); 
        this.showControls(); 
        break;
      case 0:
      case 2:
      case 5:
      case -1: 
        this.player?.playVideo?.(); 
        this.hideControls(); 
        break;
    }
  }

  seekTo(seconds: number): void {
    if (!this.playerReady) return;
    
    const time = this.getCurrentTime() + seconds;
    this.player?.seekTo?.(time, true);
  }

  // Show/hide controls
  showControls(): void {
    clearTimeout(this.HideControlsEvent);
    this.controlSection.nativeElement.classList.remove('fade-out');
  }

  hideControls(): void {
    if (this.playerReady && [1, 2].includes(this.player?.getPlayerState?.() || -1)) {
      this.HideControlsEvent = setTimeout(() => {
        this.controlSection.nativeElement.classList.add('fade-out');
      }, 3000);
    }
  }

  dynamicShowControl(): void {
    this.showControls();
    this.hideControls();
  }

  // Fullscreen toggling
  toggleFullScreen(): void {
    const container = this.watchSection.nativeElement;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      this.isFullscreen = true;
    } else {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  toggleMute(): void {
    if (!this.playerReady) return;
    
    if (this.player?.isMuted?.()) {
      this.player?.unMute?.();
    } else {
      this.player?.mute?.();
    }
  }

  startSliderInterval(): void {
    clearInterval(this.SliderUpdateEvent);
    this.SliderUpdateEvent = setInterval(() => {
      if (this.isPlaying()) {
        const sliderElement = this.slider.nativeElement as noUiSlider.target;
        sliderElement.noUiSlider?.set(this.getCurrentTime());
      }
    }, 500);
  }

  stopSliderInterval(): void {
    clearInterval(this.SliderUpdateEvent);
  }

  // Format seconds to hh:mm:ss or mm:ss
  formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const paddedMins = hrs > 0 ? String(mins).padStart(2, '0') : String(mins);
    const paddedSecs = String(secs).padStart(2, '0');
    return hrs > 0 ? `${hrs}:${paddedMins}:${paddedSecs}` : `${mins}:${paddedSecs}`;
  }

  // Seek forward/backward with overlay animation
  seekAhead(): void {
    this.seekTo(10);
    this.rightOverlay.nativeElement.classList.add('showAfter');
    setTimeout(() => {
      this.rightOverlay.nativeElement.classList.remove('showAfter');
    }, 500);
  }

  seekBack(): void {
    this.seekTo(-10);
    this.leftOverlay.nativeElement.classList.add('showAfter');
    setTimeout(() => {
      this.leftOverlay.nativeElement.classList.remove('showAfter');
    }, 500);
  }

  // Volume control
  changeVolume(delta: number): void {
    if (!this.playerReady) return;
    
    const currentVolume = this.player?.getVolume?.() || 50;
    const newVolume = Math.min(100, Math.max(0, currentVolume + delta));
    this.player?.setVolume?.(newVolume);
    const volSliderElement = this.volSlider.nativeElement as noUiSlider.target;
    volSliderElement.noUiSlider?.set(newVolume);
  }

  // Change watchID and reload player
  goToWatchPage(newId: string): void {
    if (!this.playerReady) return;
    
    this.player?.loadVideoById?.(newId);
    this.startSliderInterval();
  }

  // Setup mobile tap gestures
  private setupTouchListeners(): void {
    const overlays = [this.leftOverlay, this.centerOverlay, this.rightOverlay];
    overlays.forEach(overlay => {
      overlay.nativeElement.addEventListener('mouseover', () => {
        this.dynamicShowControl();
      });
    });

    this.leftOverlay.nativeElement.addEventListener('touchstart', (e) => this.handleTouch(e, () => this.seekBack()));
    this.centerOverlay.nativeElement.addEventListener('touchstart', (e) => this.handleTouch(e, () => this.toggleFullScreen()));
    this.rightOverlay.nativeElement.addEventListener('touchstart', (e) => this.handleTouch(e, () => this.seekAhead()));

    this.overlay.nativeElement.addEventListener('click', () => {
      this.playVideo();
      this.dynamicShowControl();
    });
  }

  private handleTouch(e: TouchEvent, action: () => void): void {
    e.preventDefault();
    const now = new Date().getTime();
    if (now - this.lastClick < 500) {
      action();
      this.playVideo();
    } else {
      this.playVideo();
    }
    this.dynamicShowControl();
    this.lastClick = now;
  }

  episodeList = [
    {
      "title": "SONIC X - EP01 Chaos Control Freaks",
      "thumbnail": "https://i.ytimg.com/vi/9CGih4gMRlk/maxresdefault.jpg",
      "duration": 1276,
      "watchID": "9CGih4gMRlk"
    },
    {
      "title": "SONIC X - EP02 Sonic to the Rescue",
      "thumbnail": "https://i.ytimg.com/vi/aBgPO32-ka0/maxresdefault.jpg",
      "duration": 1277,
      "watchID": "aBgPO32-ka0"
    },
    {
      "title": "SONIC X - EP03 Missile Wrist Rampage",
      "thumbnail": "https://i.ytimg.com/vi/PzifMBqaEvU/maxresdefault.jpg",
      "duration": 1243,
      "watchID": "PzifMBqaEvU"
    },
    {
      "title": "SONIC X - EP04 Chaos Emerald Chaos",
      "thumbnail": "https://i.ytimg.com/vi/BNi7ZoeJOOE/maxresdefault.jpg",
      "duration": 1280,
      "watchID": "BNi7ZoeJOOE"
    },
    {
      "title": "SONIC X - EP05 Cracking Knuckles",
      "thumbnail": "https://i.ytimg.com/vi/qBsRxGQhDKs/maxresdefault.jpg",
      "duration": 1280,
      "watchID": "qBsRxGQhDKs"
    },
    {
      "title": "SONIC X - EP06 Techno Teacher",
      "thumbnail": "https://i.ytimg.com/vi/ZDygQeO9jzo/maxresdefault.jpg",
      "duration": 1279,
      "watchID": "ZDygQeO9jzo"
    },
    {
      "title": "SONIC X - EP07 Party Hardly",
      "thumbnail": "https://i.ytimg.com/vi/7tB2LgOx8fA/maxresdefault.jpg",
      "duration": 1269,
      "watchID": "7tB2LgOx8fA"
    },
    {
      "title": "SONIC X - EP08 Satellite Swindle",
      "thumbnail": "https://i.ytimg.com/vi/9KYeihPwS7Q/maxresdefault.jpg",
      "duration": 1280,
      "watchID": "9KYeihPwS7Q"
    },
    {
      "title": "SONIC X - EP09 The Last Resort",
      "thumbnail": "https://i.ytimg.com/vi/ZcYxdLTcGvA/maxresdefault.jpg",
      "duration": 1279,
      "watchID": "ZcYxdLTcGvA"
    },
    {
      "title": "SONIC X - EP10 Unfair Ball",
      "thumbnail": "https://i.ytimg.com/vi/VwYQ0DnPjWI/maxresdefault.jpg",
      "duration": 1279,
      "watchID": "VwYQ0DnPjWI"
    },
    {
      "title": "SONIC X - EP11 Fly Spy",
      "thumbnail": "https://i.ytimg.com/vi/FTMUZlg7WEg/maxresdefault.jpg",
      "duration": 1282,
      "watchID": "FTMUZlg7WEg"
    },
    {
      "title": "SONIC X - EP12 Beating Eggman Part 1",
      "thumbnail": "https://i.ytimg.com/vi/EbmRA75fF6Y/maxresdefault.jpg",
      "duration": 1279,
      "watchID": "EbmRA75fF6Y"
    },
    {
      "title": "SONIC X - EP13 Beating Eggman Part 2",
      "thumbnail": "https://i.ytimg.com/vi/WurTQwB-j-U/maxresdefault.jpg",
      "duration": 1279,
      "watchID": "WurTQwB-j-U"
    },
    {
      "title": "SONIC X - EP14 That's What Friends Are for",
      "thumbnail": "https://i.ytimg.com/vi/uNqSxwLTjG4/maxresdefault.jpg",
      "duration": 1279,
      "watchID": "uNqSxwLTjG4"
    },
    {
      "title": "SONIC X - EP15 Skirmish in the Sky",
      "thumbnail": "https://i.ytimg.com/vi/w0uuhC6LlFM/maxresdefault.jpg",
      "duration": 1273,
      "watchID": "w0uuhC6LlFM"
    },
    {
      "title": "SONIC X - EP16 Depth of Danger",
      "thumbnail": "https://i.ytimg.com/vi/B_uTFBTNI7o/maxresdefault.jpg",
      "duration": 1278,
      "watchID": "B_uTFBTNI7o"
    },
    {
      "title": "SONIC X - EP17 The Adventures of Knuckles and Hawk",
      "thumbnail": "https://i.ytimg.com/vi/Vc1z6_nBWKA/maxresdefault.jpg",
      "duration": 1278,
      "watchID": "Vc1z6_nBWKA"
    },
    {
      "title": "SONIC X - EP18 The Dam Scam",
      "thumbnail": "https://i.ytimg.com/vi/hnUYv2VhcY8/maxresdefault.jpg",
      "duration": 1279,
      "watchID": "hnUYv2VhcY8"
    },
    {
      "title": "SONIC X - EP19 Sonic's Scream Test",
      "thumbnail": "https://i.ytimg.com/vi/cE7WXrzkKrI/maxresdefault.jpg",
      "duration": 1283,
      "watchID": "cE7WXrzkKrI"
    },
    {
      "title": "SONIC X - EP20 Cruise Blues",
      "thumbnail": "https://i.ytimg.com/vi/c8W-VVZtiyk/sddefault.jpg",
      "duration": 1185,
      "watchID": "c8W-VVZtiyk"
    },
    {
      "title": "SONIC X - EP21 Fast Friends",
      "thumbnail": "https://i.ytimg.com/vi/z8QGrmRQsqw/maxresdefault.jpg",
      "duration": 1278,
      "watchID": "z8QGrmRQsqw"
    },
    {
      "title": "SONIC X - EP22 Little Chao Lost",
      "thumbnail": "https://i.ytimg.com/vi/nMJG40ht_sw/maxresdefault.jpg",
      "duration": 1279,
      "watchID": "nMJG40ht_sw"
    },
    {
      "title": "SONIC X - EP23 Emerald Anniversary",
      "thumbnail": "https://i.ytimg.com/vi/1TAE09a_nwE/maxresdefault.jpg",
      "duration": 1279,
      "watchID": "1TAE09a_nwE"
    },
    {
      "title": "SONIC X - EP24 How to Catch a Hedgehog",
      "thumbnail": "https://i.ytimg.com/vi/039J77RlR5M/maxresdefault.jpg",
      "duration": 1279,
      "watchID": "039J77RlR5M"
    },
    {
      "title": "SONIC X - EP25 A Dastardly Deed",
      "thumbnail": "https://i.ytimg.com/vi/gyUnw0KCDT0/maxresdefault.jpg",
      "duration": 1283,
      "watchID": "gyUnw0KCDT0"
    },
    {
      "title": "SONIC X - EP26 Countdown to Chaos",
      "thumbnail": "https://i.ytimg.com/vi/Lj6TQAJaj4s/maxresdefault.jpg",
      "duration": 1294,
      "watchID": "Lj6TQAJaj4s"
    },
    {
      "title": "SONIC X - EP27 Pure Chaos",
      "thumbnail": "https://i.ytimg.com/vi/WkRmNHUgIVk/maxresdefault.jpg",
      "duration": 1297,
      "watchID": "WkRmNHUgIVk"
    },
    {
      "title": "SONIC X - EP28 A Chaotic Day",
      "thumbnail": "https://i.ytimg.com/vi/PnDHLNS58FY/maxresdefault.jpg",
      "duration": 1274,
      "watchID": "PnDHLNS58FY"
    },
    {
      "title": "SONIC X - EP29 A Robot Rebels",
      "thumbnail": "https://i.ytimg.com/vi/gbn7h1VqKIU/maxresdefault.jpg",
      "duration": 1276,
      "watchID": "gbn7h1VqKIU"
    },
    {
      "title": "SONIC X - EP30 Head's up, Tail",
      "thumbnail": "https://i.ytimg.com/vi/V26oyi5GDVw/maxresdefault.jpg",
      "duration": 1276,
      "watchID": "V26oyi5GDVw"
    },
    {
      "title": "SONIC X - EP31 Revenge of the Robot",
      "thumbnail": "https://i.ytimg.com/vi/kEOn7Y6wE5c/maxresdefault.jpg",
      "duration": 1271,
      "watchID": "kEOn7Y6wE5c"
    },
    {
      "title": "SONIC X - EP32 Flood Fight",
      "thumbnail": "https://i.ytimg.com/vi/OwYJkhG6xNc/maxresdefault.jpg",
      "duration": 1276,
      "watchID": "OwYJkhG6xNc"
    },
    {
      "title": "SONIC X - EP33 Project Shadow",
      "thumbnail": "https://i.ytimg.com/vi/eqyhH0FaBgc/maxresdefault.jpg",
      "duration": 1278,
      "watchID": "eqyhH0FaBgc"
    },
    {
      "title": "SONIC X - EP34 Shadow Knows",
      "thumbnail": "https://i.ytimg.com/vi/NqrXRFdb684/sddefault.jpg",
      "duration": 1274,
      "watchID": "NqrXRFdb684"
    },
    {
      "title": "SONIC X - EP35 Sonic's Big Break",
      "thumbnail": "https://i.ytimg.com/vi/NEypfVRripI/hqdefault.jpg",
      "duration": 1277,
      "watchID": "NEypfVRripI"
    },
    {
      "title": "SONIC X - EP36 Shadow World",
      "thumbnail": "https://i.ytimg.com/vi/CoDKAOsd7Uc/maxresdefault.jpg",
      "duration": 1266,
      "watchID": "CoDKAOsd7Uc"
    },
    {
      "title": "SONIC X - EP37 Robotnik's Revenge",
      "thumbnail": "https://i.ytimg.com/vi/pR7I8loqsC8/maxresdefault.jpg",
      "duration": 1308,
      "watchID": "pR7I8loqsC8"
    },
    {
      "title": "SONIC X - EP38 Showdown in Space",
      "thumbnail": "https://i.ytimg.com/vi/5d0m3UcNnWs/maxresdefault.jpg",
      "duration": 1273,
      "watchID": "5d0m3UcNnWs"
    },
    {
      "title": "SONIC X - EP39 Defective Detectives",
      "thumbnail": "https://i.ytimg.com/vi/s32IbFff9i0/maxresdefault.jpg",
      "duration": 1276,
      "watchID": "s32IbFff9i0"
    },
    {
      "title": "SONIC X - EP40 Sunblock Solution",
      "thumbnail": "https://i.ytimg.com/vi/XliSh3Ar0AQ/maxresdefault.jpg",
      "duration": 1276,
      "watchID": "XliSh3Ar0AQ"
    },
    {
      "title": "SONIC X - EP41 Eggman for President",
      "thumbnail": "https://i.ytimg.com/vi/vIz7_2tjcOU/maxresdefault.jpg",
      "duration": 1276,
      "watchID": "vIz7_2tjcOU"
    },
    {
      "title": "SONIC X - EP42 A Robot Rebels",
      "thumbnail": "https://i.ytimg.com/vi/2M9mpXbnK30/maxresdefault.jpg",
      "duration": 1261,
      "watchID": "2M9mpXbnK30"
    },
    {
      "title": "SONIC X - EP43 Mean Machines",
      "thumbnail": "https://i.ytimg.com/vi/GxZnyfL9xFw/maxresdefault.jpg",
      "duration": 1285,
      "watchID": "GxZnyfL9xFw"
    },
    {
      "title": "SONIC X - EP44 Sewer Search",
      "thumbnail": "https://i.ytimg.com/vi/Gb7GBxRTRr0/maxresdefault.jpg",
      "duration": 1243,
      "watchID": "Gb7GBxRTRr0"
    },
    {
      "title": "SONIC X - EP45 Prize Fights",
      "thumbnail": "https://i.ytimg.com/vi/fQXfRxizraE/maxresdefault.jpg",
      "duration": 1277,
      "watchID": "fQXfRxizraE"
    },
    {
      "title": "SONIC X - EP46 A Wild Win",
      "thumbnail": "https://i.ytimg.com/vi/b-qHbNGKnYE/maxresdefault.jpg",
      "duration": 1267,
      "watchID": "b-qHbNGKnYE"
    },
    {
      "title": "SONIC X - EP47 Map of Mayhem",
      "thumbnail": "https://i.ytimg.com/vi/AcYkCcRdCLo/maxresdefault.jpg",
      "duration": 1276,
      "watchID": "AcYkCcRdCLo"
    },
    {
      "title": "SONIC X - EP48 The Volcanic Venture",
      "thumbnail": "https://i.ytimg.com/vi/bmjLqrc8ugQ/maxresdefault.jpg",
      "duration": 1291,
      "watchID": "bmjLqrc8ugQ"
    },
    {
      "title": "SONIC X - EP49 The Beginning of the End",
      "thumbnail": "https://i.ytimg.com/vi/rpb3jpNSyDI/maxresdefault.jpg",
      "duration": 1260,
      "watchID": "rpb3jpNSyDI"
    },
    {
      "title": "SONIC X - EP50 Running out of Time",
      "thumbnail": "https://i.ytimg.com/vi/-INdp_kaWAc/maxresdefault.jpg",
      "duration": 1277,
      "watchID": "-INdp_kaWAc"
    },
    {
      "title": "SONIC X - EP51 Friends 'Til the End",
      "thumbnail": "https://i.ytimg.com/vi/bAo4Tiifwjk/maxresdefault.jpg",
      "duration": 1279,
      "watchID": "bAo4Tiifwjk"
    },
    {
      "title": "SONIC X - EP52 A New Start",
      "thumbnail": "https://i.ytimg.com/vi/qAtidd45kzI/maxresdefault.jpg",
      "duration": 1243,
      "watchID": "qAtidd45kzI"
    },
    {
      "title": "SONIC X - EP53 A Cosmic Call",
      "thumbnail": "https://i.ytimg.com/vi/7blfEcxZ_U8/maxresdefault.jpg",
      "duration": 1288,
      "watchID": "7blfEcxZ_U8"
    },
    {
      "title": "SONIC X - EP54 Cosmic Crisis",
      "thumbnail": "https://i.ytimg.com/vi/30b-BHrYDms/maxresdefault.jpg",
      "duration": 1284,
      "watchID": "30b-BHrYDms"
    },
    {
      "title": "SONIC X - EP55 H2 Whoa",
      "thumbnail": "https://i.ytimg.com/vi/a8QEVZIFypY/maxresdefault.jpg",
      "duration": 1280,
      "watchID": "a8QEVZIFypY"
    },
    {
      "title": "SONIC X - EP56 An Enemy in Need",
      "thumbnail": "https://i.ytimg.com/vi/S6TgUS3H7M8/maxresdefault.jpg",
      "duration": 1280,
      "watchID": "S6TgUS3H7M8"
    },
    {
      "title": "SONIC X - EP57 Chilling Discovery",
      "thumbnail": "https://i.ytimg.com/vi/0T_If4pEFRc/maxresdefault.jpg",
      "duration": 1287,
      "watchID": "0T_If4pEFRc"
    },
    {
      "title": "SONIC X - EP58 Desperately Seeking Sonic",
      "thumbnail": "https://i.ytimg.com/vi/yCAwN9HPSlY/maxresdefault.jpg",
      "duration": 1280,
      "watchID": "yCAwN9HPSlY"
    },
    {
      "title": "SONIC X - EP59 Galactic Gumshoes",
      "thumbnail": "https://i.ytimg.com/vi/lBH6JASM4dk/maxresdefault.jpg",
      "duration": 1265,
      "watchID": "lBH6JASM4dk"
    },
    {
      "title": "SONIC X - EP60 Trick Sand",
      "thumbnail": "https://i.ytimg.com/vi/-b2KKXXHJPs/maxresdefault.jpg",
      "duration": 1288,
      "watchID": "-b2KKXXHJPs"
    },
    {
      "title": "SONIC X - EP61 Ship of Doom",
      "thumbnail": "https://i.ytimg.com/vi/SKHF26ZySME/maxresdefault.jpg",
      "duration": 1235,
      "watchID": "SKHF26ZySME"
    },
    {
      "title": "SONIC X - EP62 An Underground Odyssey",
      "thumbnail": "https://i.ytimg.com/vi/_KiEP2atRwU/maxresdefault.jpg",
      "duration": 1274,
      "watchID": "_KiEP2atRwU"
    },
    {
      "title": "SONIC X - EP63 Station Break-In",
      "thumbnail": "https://i.ytimg.com/vi/N9nr9uqgN9I/maxresdefault.jpg",
      "duration": 1251,
      "watchID": "N9nr9uqgN9I"
    },
    {
      "title": "SONIC X - EP64 A Materex Melee",
      "thumbnail": "https://i.ytimg.com/vi/hq9LlgTLmP0/maxresdefault.jpg",
      "duration": 1231,
      "watchID": "hq9LlgTLmP0"
    },
    {
      "title": "SONIC X - EP65 Mission: Match Up",
      "thumbnail": "https://i.ytimg.com/vi/uv3Jdfkymc8/maxresdefault.jpg",
      "duration": 1224,
      "watchID": "uv3Jdfkymc8"
    },
    {
      "title": "SONIC X - EP66 Clash in the Cloister",
      "thumbnail": "https://i.ytimg.com/vi/We3UBNdfbnM/maxresdefault.jpg",
      "duration": 1203,
      "watchID": "We3UBNdfbnM"
    },
    {
      "title": "SONIC X - EP67 Testing Time",
      "thumbnail": "https://i.ytimg.com/vi/8ykblfGXgcI/maxresdefault.jpg",
      "duration": 1222,
      "watchID": "8ykblfGXgcI"
    },
    {
      "title": "SONIC X - EP68 A Revolutionary Tale",
      "thumbnail": "https://i.ytimg.com/vi/CL9tRwaOIzU/maxresdefault.jpg",
      "duration": 1208,
      "watchID": "CL9tRwaOIzU"
    },
    {
      "title": "SONIC X - EP69 The Planet of Misfortune",
      "thumbnail": "https://i.ytimg.com/vi/QbzRj1lHeP8/maxresdefault.jpg",
      "duration": 1232,
      "watchID": "QbzRj1lHeP8"
    },
    {
      "title": "SONIC X - EP70 Terror On the Typhoon",
      "thumbnail": "https://i.ytimg.com/vi/1pZpQ9lfrJA/maxresdefault.jpg",
      "duration": 1209,
      "watchID": "1pZpQ9lfrJA"
    },
    {
      "title": "SONIC X - EP71 Hedgehog Hunt",
      "thumbnail": "https://i.ytimg.com/vi/SOHgRGpqd8Y/maxresdefault.jpg",
      "duration": 1198,
      "watchID": "SOHgRGpqd8Y"
    },
    {
      "title": "SONIC X - EP72 Zelkova Strikes Back",
      "thumbnail": "https://i.ytimg.com/vi/0LGDfZngevs/maxresdefault.jpg",
      "duration": 1156,
      "watchID": "0LGDfZngevs"
    },
    {
      "title": "SONIC X - EP73 The Cosmo Conspiracy",
      "thumbnail": "https://i.ytimg.com/vi/CkI-2j6V7sQ/maxresdefault.jpg",
      "duration": 1200,
      "watchID": "CkI-2j6V7sQ"
    },
    {
      "title": "SONIC X - EP74 Eye Spy",
      "thumbnail": "https://i.ytimg.com/vi/Y_GBzuo-T6g/maxresdefault.jpg",
      "duration": 1206,
      "watchID": "Y_GBzuo-T6g"
    },
    {
      "title": "SONIC X - EP75 Agent of Mischief",
      "thumbnail": "https://i.ytimg.com/vi/MRPAoi0PjU8/maxresdefault.jpg",
      "duration": 1214,
      "watchID": "MRPAoi0PjU8"
    },
    {
      "title": "SONIC X - EP76 The Light in the Darkness",
      "thumbnail": "https://i.ytimg.com/vi/7lTR0Ys6k7o/maxresdefault.jpg",
      "duration": 1263,
      "watchID": "7lTR0Ys6k7o"
    },
    {
      "title": "SONIC X - EP77 A Fearless Friend",
      "thumbnail": "https://i.ytimg.com/vi/rU_nFxK4iek/maxresdefault.jpg",
      "duration": 1264,
      "watchID": "rU_nFxK4iek"
    },
    {
      "title": "SONIC X - EP78 So Long Sonic",
      "thumbnail": "https://i.ytimg.com/vi/WszPVaOgfR8/maxresdefault.jpg",
      "duration": 1154,
      "watchID": "WszPVaOgfR8"
    }
  ];

}
 
