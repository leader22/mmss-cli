# mmss-cli

My Mp3 Streaming Server CLI.

# Why?

- Mp3のストリーミングサーバーには、ID3の解析がマスト
- ただしこれをJavaScriptでやるのはかなりハード
  - 処理速度の問題、ファイルI/Oの問題、文字コードの問題、etc..
- 母艦がiTunesであるなら、そこのデータを使うのが確実かつ圧倒的に楽

# How to use

```
Usage: mmss-cli --input [path/to/playlist.txt] --output [path/to/music.json]

オプション:
  -i, --input                                                           [必須]
  -o, --output                                      [デフォルト: "./music.json"]
```

# playlist.txt

- iTunesを起動
- 「ファイル」 > 「ライブラリ」 > 「プレイリストをエクスポート」 > テキストファイル
  - その他の形式だと、ファイル数が多い場合に書き出しに時間がかかりすぎてダメ・・？

# music.json
```js
declare type MusicJSON = Artist[];

declare type Artist = {
  name: string;
  albums: Album[];
};

declare type Album = {
  name: string;
  year: string;
  songs: Song[];
};

declare type Song = {
  name: string;
  artist: string;
  album: string;
  disc: string;
  track: string;
  duration: string;
  path: string;
};
```
