
![kalk](img/zen.png)

#### How to build the app on a mac

Install build dependencies [node](https://nodejs.org) and [zig](https://ziglang.org/) via [brew](https://brew.sh/), 
clone the repository, build and run the app:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node zig

git clone https://github.com/monsterkodi/kalk.git

cd ./kalk/kalk.app

./kk -bkr
```

#### How to run the app on linux

Install [node](https://nodejs.org) and [pnpm](https://pnpm.io/), then:

```
cd ./kalk/kalk.app
pnpm install
./kk -r
```

On linux the app runs in [electron](https://www.electronjs.org/) using the
same js sources. The native cocoa host in `src/` is not built; `./kk -b`
skips it.

Chromium's native wayland backend does not share the clipboard with the
desktop, so `kk` launches electron under x11 (xwayland). Xwayland does not
know the compositor's scale factor, so `kk` also passes
`--force-device-scale-factor` taken from the focused hyprland monitor. Set
`KALK_SCALE` to override it. Both flags have to be on the command line
because electron picks the ozone platform and the scale factor before the
app code runs. `pnpm start` runs electron directly.

The window is a small frameless panel that sizes itself. Tiling compositors
stretch it, so on hyprland add this to `~/.config/hypr/apps.lua`:

```lua
o.window("^kalk$", {
  float = true,
})
```

`pnpm test:electron` runs the tests for the linux host.

