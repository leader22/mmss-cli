# mmss-cli

My Mp3 Streaming Server CLI.

# Why?

- Mp3のストリーミングサーバーには、ID3の解析がマスト
- ただしこれをJavaScriptでやるのはかなりハード
  - 処理速度の問題、ファイルI/Oの問題、文字コードの問題、etc..
- 母艦がiTunesであるなら、そこのデータを使うのが確実かつ圧倒的に楽

# How to use

```
mmss-cli -i path/to/music.txt -o path/to/music.json
```

# music.txt

- iTunesを起動
- ライブラリ > 曲を表示
- 追加日で降順ソート
- 「ファイル」 > 「ライブラリ」 > 「プレイリストをエクスポート」
  - エンコードは標準テキスト

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
