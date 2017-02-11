# mmss-cli

My Mp3 Streaming Server Cli.

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
```json
{
  artistA: {
    albumA: [song, song, ..., song],
    albumB: [song, song, ..., song],
  },
  artistB: {},
}
```

```json
const song = {
  name: '進水式',
  artist: 'KIRINJI',
  album: '11',
  duration: '280',
  disc: '1',
  discs: '1',
  track: '1',
  tracks: '11',
  year: '2014',
  path: 'KIRINJI/11/KIRINJI - 進水式.mp3',
  albumArtist: 'KIRINJI'
};
```
