from flask import Flask, render_template, request, jsonify, session
from boggle import Boggle
import string
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'

boggle_game = Boggle()

@app.route('/')
def home():
    session['board'] = boggle_game.make_board()
    return render_template('index.html', board=session['board'])

@app.route('/check-word', methods=['POST'])
def check_word():
    word = request.json['word']
    result = boggle_game.check_valid_word(session['board'], word)
    return jsonify({'result': result})

@app.route('/play-again', methods=['POST'])
def play_again():
    session['board'] = boggle_game.make_board()
    return jsonify({'result': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)