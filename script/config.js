// WELCOME TO NWY_LOADING CONFIG
window.nwyConfig = {
    youtubeVideoId: "d7cF2IYkB9Y", // Youtube Content Id - https://www.youtube.com/watch?v=(wX524GyIJek) The Part Afte v=
    discordInviteLink: "https://discord.gg/5eSqXCjQV8", // Your Discord Invite Link

    logoUrl: "img/logo.png", // Logo Which Came While Loading
    welcomeTitle: "WELCOME TO NOWAY STORE", // Welcome Title
    welcomeDescription: "Welcome to NOWAY STORE Your Ultimate Destination for FiveM Scripts!", // Your Welcome Description

    changelogs: [
        {
            date: "18/04/2025",
            title: "NEW LOADING SCREEN",
            description: "Implemented a fully dynamic loading screen with config system."
        },
        {
            date: "17/04/2025",
            title: "DISCORD INTEGRATION",
            description: "Added Discord invite support and online count display."
        },
        {
            date: "15/04/2025",
            title: "SERVER LAUNCH",
            description: "nwy server has been launched with full features."
        }
    ],

    team: [
        { img: "img/member1.png", discord: "Noway#3456", role: "Owner" },
        { img: "img/member2.jpg", discord: "Dev#1097", role: "Developer" }
    ],

    musicList: [
        { label: "Lie 2 You", author: "Dylan Emmet", src: "audio/music1.mp3" }, 
        { label: "Token", author: "Cloe Sutherland", src: "audio/music2.mp3" }
    ],

    keybindCategories: [
        {
            name: "General",
            binds: [
                { key: "F1", function: "Phone", description: "Opens your phone" },
                { key: "F2", function: "Inventory", description: "Opens your inventory" },
                { key: "F4", function: "Emote Menu", description: "Opens your emote menu" }
            ]
        }
    ],


    previewGallery: [
        { label: "Main City", src: "img/gallery1.png" },
        { label: "Police HQ", src: "img/gallery2.png" },
        { label: "Night Club", src: "img/gallery3.png" }
    ],


    hint: {
        enabled: true,
        messages: [
            "💡 Hint: Press the three lines in the corner to toggle the UI!", // You Can Add The Hint Like In The Front "💡 Hint: Noway Loading Screen"
            "💡 Hint: Press F2 to open your inventory.",
            "💡 Hint: Join our Discord for updates!"
        ],
        interval: 10000 // Time When Did The Hint Message Need To Come:Current 1 mins
    }
}    