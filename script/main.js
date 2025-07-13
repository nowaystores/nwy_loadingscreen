// script/main.js

document.addEventListener('alpine:init', () => {
    Alpine.data('Main', () => ({
        show: false,
        musicOpen: true,
        isMusicPlaying: true,
        memberCount: 0,
        overlayHidden: false,
        selectedCategory: 0,

        youtubePlayer: null,
        youtubeVideoId: window.nwyConfig.youtubeVideoId,
        youtubeVideoIdInput: window.nwyConfig.youtubeVideoId,

        DiscordInviteLink: window.nwyConfig.discordInviteLink,
        buttons: [
            { label: 'Home', selected: true },
            { label: 'Changelogs', selected: false },
            { label: 'Team', selected: false },
            { label: 'Keybinds', selected: false },
            { label: 'Settings', selected: false },
        ],

        team: window.nwyConfig.team,
        musicList: window.nwyConfig.musicList,
        keybindCategories: window.nwyConfig.keybindCategories,
        changelogs: window.nwyConfig.changelogs,

        // Hint logic
        hintEnabled: window.nwyConfig.hint.enabled,
        hintMessages: window.nwyConfig.hint.messages || [window.nwyConfig.hint.message],
        hintInterval: window.nwyConfig.hint.interval,
        hintIndex: 0,
        hintMessage: "",
        showHint: false,

        currentSong: 0,
        audio: null,

        // New state for image viewer
        showImageViewer: false,
        galleryIndex: 0,
        previewGallery: window.nwyConfig.previewGallery || [],

        forceCursorVisibility() {
            try {
                if (window.invokeNative) {
                    window.invokeNative('setCursorLocation', 0.5, 0.5);
                    window.invokeNative('showCursor', true);
                    if (window.GetParentResourceName) {
                        const resourceName = window.GetParentResourceName();
                        if (resourceName) {
                            window.postMessage({ type: "forceCursor", resource: resourceName }, '*');
                        }
                    }
                }
            } catch (error) {
                console.log('FiveM cursor visibility not available in browser');
            }
        },

        setupCursorVisibilityChecks() {
            setInterval(() => {
                if (this.show) this.forceCursorVisibility();
            }, 2000);
        },

        listen() {
            this.show = true;
            this.audio = new Audio();
            this.fetchMemberCount();
            this.forceCursorVisibility();

            if (this.musicList.length > 0) {
                this.audio.src = this.musicList[this.currentSong].src;
                this.audio.load();
                if (this.isMusicPlaying) {
                    this.audio.play().catch(err => console.log('Autoplay blocked:', err));
                }
            }            

            this.audio.addEventListener('ended', () => this.next());
            this.initYouTubeBackground();

            // ✅ Show hint periodically (multi-hint logic)
            if (this.hintEnabled && this.hintMessages.length > 0) {
                this.hintMessage = this.hintMessages[this.hintIndex];
                setInterval(() => {
                    this.showHint = true;
                    this.hintMessage = this.hintMessages[this.hintIndex];
                    this.hintIndex = (this.hintIndex + 1) % this.hintMessages.length;
                    setTimeout(() => this.showHint = false, 5000);
                }, this.hintInterval);
            }

            window.addEventListener('message', (event) => {
                if (event.data.type === 'show') {
                    this.show = event.data.status;
                    if (this.show) this.forceCursorVisibility();
                }
            });

            document.addEventListener('mousemove', () => this.forceCursorVisibility());
            document.addEventListener('mousedown', () => this.forceCursorVisibility());
            document.addEventListener('mouseup', () => this.forceCursorVisibility());

            this.setupCursorVisibilityChecks();
            this.updateLoadingProgress();

            const savedVideoId = localStorage.getItem('youtubeVideoId');
            if (savedVideoId) {
                this.youtubeVideoId = savedVideoId;
                this.youtubeVideoIdInput = savedVideoId;
            }
        },

        initYouTubeBackground() {
            window.onYouTubeIframeAPIReady = () => {
                this.createYouTubePlayer(this.youtubeVideoId);
            };
            if (window.YT && window.YT.Player) {
                this.createYouTubePlayer(this.youtubeVideoId);
            }
        },

        createYouTubePlayer(videoId) {
            const container = document.getElementById('youtube-background');
            if (!container) return;
            container.innerHTML = '';
            this.youtubePlayer = new YT.Player(container, {
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    showinfo: 0,
                    rel: 0,
                    loop: 1,
                    modestbranding: 1,
                    iv_load_policy: 3,
                    fs: 0,
                    cc_load_policy: 0,
                    playlist: videoId
                },
                events: {
                    onReady: (e) => {
                        e.target.setVolume(0);
                        e.target.playVideo();
                    },
                    onStateChange: (e) => {
                        if (e.data === YT.PlayerState.ENDED) {
                            e.target.playVideo();
                        }
                    }
                }
            });
        },

        setYoutubeBackground(videoId) {
            if (!videoId) return;
            this.youtubeVideoId = videoId;
            localStorage.setItem('youtubeVideoId', videoId);
            if (this.youtubePlayer?.loadVideoById) {
                this.youtubePlayer.loadVideoById({ videoId: videoId });
            } else {
                this.createYouTubePlayer(videoId);
            }
        },

        applyYoutubeVideo() {
            if (this.youtubeVideoIdInput && this.youtubeVideoIdInput.trim() !== '') {
                this.setYoutubeBackground(this.youtubeVideoIdInput.trim());
            }
        },

        updateLoadingProgress() {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 5;
                if (progress > 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                document.querySelector('.loading-progress').style.width = `${progress}%`;
                document.querySelector('.loading-text').textContent = `Loading game (${Math.floor(progress)}%)`;
            }, 500);
        },

        selectBtn(selected) {
            this.buttons.forEach(btn => btn.selected = false);
            selected = true;
            return selected;
        },

        play() {
            this.audio.play().catch(e => console.log('Audio play error:', e));
            this.isMusicPlaying = true;
        },

        pause() {
            this.audio.pause();
            this.isMusicPlaying = false;
        },

        next() {
            this.currentSong = (this.currentSong + 1) % this.musicList.length;
            this.audio.src = this.musicList[this.currentSong].src;
            if (this.isMusicPlaying) this.audio.play().catch(() => {});
        },

        prev() {
            this.currentSong = (this.currentSong - 1 + this.musicList.length) % this.musicList.length;
            this.audio.src = this.musicList[this.currentSong].src;
            if (this.isMusicPlaying) this.audio.play().catch(() => {});
        },

        fetchMemberCount() {
            this.memberCount = 254; // placeholder
        },

        toggleOverlay() {
            this.overlayHidden = !this.overlayHidden;
            document.getElementById('overlay-toggle')?.classList.toggle('active', this.overlayHidden);
            localStorage.setItem('overlayHidden', this.overlayHidden);
        },

        closeMenu() {
            this.show = false;
            try {
                const res = window.GetParentResourceName?.();
                if (window.invokeNative && res) {
                    window.postMessage({ type: "close", resource: res }, '*');
                }
            } catch (error) {
                console.log('FiveM integration not available');
            }
        },

        isKeyHighlighted(key) {
            return this.keybindCategories[this.selectedCategory].binds.some(bind =>
                bind.key.toUpperCase() === key.toUpperCase()
            );
        },

        getKeyFunction(key) {
            const bind = this.keybindCategories[this.selectedCategory].binds.find(
                bind => bind.key.toUpperCase() === key.toUpperCase()
            );
            return bind?.function || '';
        },

        // New methods for image viewer
        nextImage() {
            this.galleryIndex = (this.galleryIndex + 1) % this.previewGallery.length;
        },

        prevImage() {
            this.galleryIndex = (this.galleryIndex - 1 + this.previewGallery.length) % this.previewGallery.length;
        }
    }));
});