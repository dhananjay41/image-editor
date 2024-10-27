import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchImages } from "../services/imageService";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  console.log(images, "kkkkkk");
  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const results = await searchImages(query);
      if (results.length === 0) {
        setError("No images found for your search.");
      } else {
        setImages(results);
      }
    } catch (error) {
      console.error(error);
      setError("Error fetching images. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const selectImage = (image) => {
    navigate("/edit", { state: { imageUrl: image } }); 
  };

  return (
    <div>
      <h1>Enter a keyword to explore amazing images!</h1>

      <div className="d-flex">
        <Form.Control
          type="text"
          value={query}
          name="search"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for images..."
        />
        <Button variant="outline-dark ms-2" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {error && <div className="text-danger mt-2">{error}</div>}

      <div className="row mt-3">
        <div className="col">
          {loading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {images.map((image, i) => (
                <Col key={i}>
                  <Card border="secondary">
                    <Card.Img
                      variant="top"
                      className="search-image"
                      src={image.urls.small}
                      alt={image.alt_description}
                    />
                    <Card.Body>
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => selectImage(image.urls.full)}
                      >
                        Add Captions
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
