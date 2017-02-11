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
  -i, --input                                                             [必須]
  -o, --output                                      [デフォルト: "./music.json"]
```

# playlist.txt

- iTunesを起動
- 「ファイル」 > 「ライブラリ」 > 「プレイリストをエクスポート」 > テキストファイル
  - その他の形式だと、ファイル数が多い場合に書き出しに時間がかかりすぎてダメ
