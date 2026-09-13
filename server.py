import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, quote, urlparse
from urllib.request import Request, urlopen


class MovieAppHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        request_url = urlparse(self.path)

        if request_url.path == "/api/ai":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            
            try:
                body = json.loads(post_data.decode("utf-8")) if post_data else {}
            except json.JSONDecodeError:
                return self.send_json({"error": "Invalid JSON body."}, 400)

            prompt = body.get("prompt", "").strip()
            model = body.get("model", "gemini-3.6-flash").strip()
            persona = body.get("persona", "general").strip()

            if not prompt:
                return self.send_json({"error": "Please enter a prompt query."}, 400)

            system_prompts = {
                "tutor": "You are an expert Coding Tutor. Explain concepts clearly with concise steps and short code examples.",
                "writer": "You are a Creative Writer. Write engaging, imaginative, and well-crafted text.",
                "sarcastic": "You are a Sarcastic Assistant. Give witty and slightly humorous but accurate answers.",
                "general": "You are a helpful and polite AI Assistant."
            }
            sys_prefix = system_prompts.get(persona, system_prompts["general"])
            full_prompt = f"{sys_prefix}\n\nUser Prompt: {prompt}"

            gemini_api_key = os.environ.get("GEMINI_API_KEY")

            if not gemini_api_key:
                return self.send_json({
                    "response": f"[Demo AI Orchestrator ({model})]: GEMINI_API_KEY environment variable is not set. To enable live responses, set $env:GEMINI_API_KEY=\"your_key\" in your terminal.\n\nSimulated answer for: \"{prompt}\""
                }, 200)

            try:
                gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={quote(gemini_api_key)}"
                payload = json.dumps({
                    "contents": [{"parts": [{"text": full_prompt}]}]
                }).encode("utf-8")

                request = Request(
                    gemini_url,
                    data=payload,
                    headers={
                        "Content-Type": "application/json",
                        "User-Agent": "NeuralCore/1.0"
                    },
                    method="POST"
                )

                with urlopen(request, timeout=15) as response:
                    res_data = json.load(response)

                candidates = res_data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    ai_text = "".join([p.get("text", "") for p in parts])
                    return self.send_json({"response": ai_text}, 200)

                return self.send_json({"error": "No response text generated from Gemini API."}, 502)

            except HTTPError as error:
                return self.send_json({"error": f"Gemini API returned HTTP {error.code}."}, 502)
            except URLError as error:
                return self.send_json({"error": f"Could not reach Gemini API: {error.reason}"}, 502)

        return super().do_POST()

    def do_GET(self):
        request_url = urlparse(self.path)

        if request_url.path != "/api/movies":
            return super().do_GET()

        movie_title = parse_qs(request_url.query).get("title", [""])[0].strip()
        api_key = os.environ.get("TMDB_API_KEY", "d20c83ad431b2f184af053d199703030")

        if not api_key:
            return self.send_json({"error": "The TMDB API key has not been configured."}, 500)
        if not movie_title:
            return self.send_json({"error": "Enter a movie title to search."}, 400)

        try:
            tmdb_url = f"https://api.themoviedb.org/3/search/movie?api_key={quote(api_key)}&query={quote(movie_title)}"
            request = Request(tmdb_url, headers={"User-Agent": "CineSearch/1.0"})
            with urlopen(request, timeout=10) as response:
                data = json.load(response)
        except HTTPError as error:
            return self.send_json({"error": f"TMDB returned HTTP {error.code}."}, 502)
        except URLError as error:
            return self.send_json({"error": f"Could not reach TMDB: {error.reason}"}, 502)

        results = data.get("results", [])
        if not results:
            return self.send_json({"error": "Movie not found."}, 404)

        first = results[0]
        poster_path = first.get("poster_path")
        poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else "N/A"
        release_date = first.get("release_date", "")
        year = release_date.split("-")[0] if release_date else "N/A"

        movie = {
            "Title": first.get("title", "Unknown"),
            "Year": year,
            "Type": "Movie",
            "imdbRating": str(round(first.get("vote_average", 0), 1)) if first.get("vote_average") else "N/A",
            "Runtime": "N/A",
            "Genre": "N/A",
            "Plot": first.get("overview") or "No summary available.",
            "Poster": poster_url
        }

        return self.send_json(movie, 200)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def send_json(self, data, status=200):
        response = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(response)))
        self.end_headers()
        self.wfile.write(response)


if __name__ == "__main__":
    print("Movie app server running at http://127.0.0.1:8000")
    ThreadingHTTPServer(("127.0.0.1", 8000), MovieAppHandler).serve_forever()