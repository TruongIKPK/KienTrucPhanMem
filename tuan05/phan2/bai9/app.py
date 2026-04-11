from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to Flask Application',
        'status': 'success',
        'version': '1.0.0'
    })

@app.route('/api/hello')
def hello():
    return jsonify({
        'message': 'Hello from Flask!',
        'status': 'success'
    })

@app.route('/api/info')
def info():
    return jsonify({
        'app': 'Flask Docker Application',
        'framework': 'Flask',
        'version': '1.0.0',
        'status': 'running'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
