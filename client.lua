-- Local variables
local display = false

-- Register command to toggle keybinds display
RegisterCommand('keybinds', function()
    SetDisplay(not display)
end, false)

-- Add a keybind to toggle the display (K key)
RegisterKeyMapping('keybinds', 'Show/Hide Keybinds', 'keyboard', 'K')

-- NUI Callback for closing the display
RegisterNUICallback('close', function(data, cb)
    SetDisplay(false)
    cb('ok')
end)

-- Function to set the display state
function SetDisplay(bool)
    display = bool
    SetNuiFocus(bool, bool)
    SendNUIMessage({
        type = "show",
        status = bool
    })
end

-- Initialize display as hidden
Citizen.CreateThread(function()
    while true do
        if display then
            DisableControlAction(0, 1, display) -- LookLeftRight
            DisableControlAction(0, 2, display) -- LookUpDown
            DisableControlAction(0, 142, display) -- MeleeAttackAlternate
            DisableControlAction(0, 18, display) -- Enter
            DisableControlAction(0, 322, display) -- ESC
            DisableControlAction(0, 106, display) -- VehicleMouseControlOverride
        end
        Citizen.Wait(0)
    end
end)

-- Don't remove - this prevents errors if the resource is restarted while the UI is showing
AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() then
        SetDisplay(false)
    end
end)