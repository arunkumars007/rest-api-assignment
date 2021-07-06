from flask import Flask, render_template, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_sqlalchemy import SQLAlchemy
import math

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)

api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('type')
parser.add_argument('x')
parser.add_argument('y')


class MathOperation(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    function_name = db.Column(db.String(100))

    def __init__(self, function_name):
        self.function_name = function_name

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'function_name': self.function_name
            }


class PerformFunction(Resource):
    def post(self):
        try:
            args = parser.parse_args()
            function_type = args['type']
            x = int(args['x'])
            y = 1
            if args['y']:
                y = int(args['y'])

            switcher = {
                'Addition': x + y,
                'Subtraction': x - y,
                'Division': x / y,
                'Multiplication': x * y,
                'Square Root': math.sqrt(x),
                'Cube Root': x**x,
            }
            result = switcher.get(function_type, "")
            return jsonify({'result': result})
        except Exception as e:
            print(e)
            return jsonify({'result': 'error'})
        

class DeleteFunction(Resource):
    def delete(self, function_id):
        try:
            obj = MathOperation.query.filter_by(id=function_id).one()
            db.session.delete(obj)
            db.session.commit()
            return jsonify({'message': 'success'})
        except Exception as e:
            print(e)
            return jsonify({'message': 'error'})
        


class MathFunction(Resource):
    def get(self):
        try:
            result = [i.serialize for i in MathOperation.query.all()]
            return jsonify(data=result)
        except Exception as e:
            print(e)
            return jsonify({'message': 'error'})
            
    def post(self):
        try:
            args = parser.parse_args()
            operation = MathOperation(function_name=args['type'])
            db.session.add(operation)
            db.session.commit()
            return jsonify({'message': 'success'})
        except Exception as e:
            print(e)
            return jsonify({'message': 'error'})

##
## Actually setup the Api resource routing here
##
api.add_resource(MathFunction, '/all_operations')
api.add_resource(DeleteFunction, '/function/<function_id>')
api.add_resource(PerformFunction, '/perform_function')


@app.route('/', methods=['GET'])
def home():
    return render_template("main/home.html")


if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)