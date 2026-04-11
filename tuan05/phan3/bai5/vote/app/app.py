from flask import Flask, render_template, request, redirect, url_for
import redis
import os
import logging

app = Flask(__name__)

# Redis connection
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_PORT', 6379))
r = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

VOTE_OPTIONS = ['java', 'python', 'node.js']

@app.route('/')
def index():
    return render_template('index.html', options=VOTE_OPTIONS)

@app.route('/vote', methods=['POST'])
def vote():
    vote_option = request.form.get('vote')
    
    if vote_option not in VOTE_OPTIONS:
        return redirect(url_for('index'))
    
    # Get voter ID from cookies (simplified)
    voter_id = request.cookies.get('voter_id', 'anonymous')
    
    # Store vote in Redis queue
    r.lpush('votes', vote_option)
    
    logger.info(f"Vote received: {vote_option} from {voter_id}")
    
    return render_template('thanks.html', vote=vote_option)

@app.route('/health')
def health():
    return {'status': 'OK'}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=False)
