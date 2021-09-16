import { Component } from 'react';
import { withRouter } from 'react-router';
import { Card, Button} from 'react-bootstrap';
import "./Cart.css"


class Cart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            cart: []
        }
    }
    componentDidMount() {
        const token = this.props.token    
        const user = JSON.parse(localStorage.getItem('user_details'))    
        fetch(`http://localhost:8000/cart?user_id=${user.id}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token.replace(/^"(.*)"$/, '$1')
            },
        })
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            this.setState({ cart: data })
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
    }
    
    deleteFromCart = (cart_id) => {
        const token = this.props.token
        fetch(`http://localhost:8000/cart/${cart_id}`, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token.replace(/^"(.*)"$/, '$1')
            }
        })
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
    }

    render() {
        return (
            <div className="row">
                {this.state.cart.map(cart =>
                    <Card key={cart.id} className="categories_align card-hover" style={{ width: '18rem' }}>
                        <Card.Title>{cart.products.name}</Card.Title>
                        <Card.Text>
                            {cart.products.description}
                        </Card.Text>
                        <Card.Img className="img-fluid" variant="top" src={`http://localhost:8000${cart.products.image.substring(1)}`} />
                        <Card.Body>
                            <Card.Text>
                                Price : {cart.products.price} INR
                            </Card.Text>
                            <Card.Text>
                                Quantity : {cart.quantity}
                            </Card.Text>
                        </Card.Body>
                        <div className="row">
                            <div className="col-12">
                                <Button className=".button-align" variant="primary">Place Order</Button>
                                <Button onClick={()=>{this.deleteFromCart(cart.id);}} variant="primary">Remove</Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        )
    }
}
export default withRouter(Cart);