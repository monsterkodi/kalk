
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

