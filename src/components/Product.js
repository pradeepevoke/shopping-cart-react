import { Component } from 'react';
import { withRouter } from 'react-router';
import { Card, Button } from 'react-bootstrap';


class Product extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: []
        }
    }
    componentDidMount() {
        const token = this.props.token
        
        const category_id = this.props.match.params.category_id;

        fetch(`http://localhost:8000/products?category_id=${category_id}`, {
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
            this.setState({ products: data })
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
    }
    
    addToCart = (product_id) => {
        const token = this.props.token
        
        const user = JSON.parse(localStorage.getItem('user_details'))
        fetch(`http://localhost:8000/cart/add`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token.replace(/^"(.*)"$/, '$1')
            },
            body:JSON.stringify({
                "user_id": user.id,
                "product_id": product_id,
                "quantity": 1
            })
        })
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            console.log(data)
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
    }

    render() {
        return (
            <div className="row">
                {this.state.products.map(products =>
                    <Card key={products.id} className="categories_align card-hover" style={{ width: '18rem' }}>
                        <Card.Title>{products.name}</Card.Title>
                        <Card.Text>
                            {products.description}
                        </Card.Text>
                        <Card.Img className="img-fluid" variant="top" src={`http://localhost:8000${products.image.substring(1)}`} />
                        <Card.Body>
                            <Card.Text>
                                Price : {products.price} INR
                            </Card.Text>
                        </Card.Body>
                        <Button onClick={()=>{this.addToCart(products.id)}} variant="primary">Add to cart</Button>
                    </Card>
                )}
            </div>
        )
    }
}
export default withRouter(Product);