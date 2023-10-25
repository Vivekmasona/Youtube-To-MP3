from flask import Flask, request, render_template, send_file
import yt_dlp
import requests
import os

app = Flask(__name)

@app.route('/download', methods=['GET'])
def download_video():
    video_url = request.args.get('url')

    if not video_url:
        return "Please provide a valid video URL."

    try:
        video_file = download_video_by_url(video_url)
        return send_file(video_file, as_attachment=True)
    except Exception as e:
        return str(e)

def download_video_by_url(url):
    # You would need to implement logic to identify the platform and handle downloading accordingly.
    # For simplicity, let's assume we're only dealing with YouTube videos using yt-dlp.
    if "youtube.com" in url:
        ydl_opts = {}
        ydl = yt_dlp.YoutubeDL(ydl_opts)
        info_dict = ydl.extract_info(url, download=False)
        video_title = info_dict.get('title', 'video')
        video_file = video_title + ".mp4"
        ydl.download([url])
        return video_file

    raise Exception("Unsupported video platform or invalid URL.")

if __name__ == '__main__':
    app.run(debug=True)


