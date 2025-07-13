fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'NOWAY STORE'
description 'nwy_loadingscreen for fivem'
version '1.0.1'

escrow_ignore {
    'script/*.js',
    'style/main.css',
    'index.html',
}

loadscreen 'index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'

client_script 'client.lua'

files {
    'index.html',
    'style/*.css',
    'script/*.js',
    'img/*.svg',
    'img/*.png',
    'img/*.jpg',
    'img/*.mp4',
    'audio/*.mp3'
}

