"use client";
import React, { useState, useMemo } from "react";
import EmptyMovieList from "./emptyMovieList";
import MovieCard from "./movieCard";
import { Col, Container, Row, Pagination, Spinner } from "react-bootstrap";
import { BoxArrowRight, PlusCircle } from "react-bootstrap-icons";
import { useRouter } from "next/navigation";
import { useGetMoviesQuery } from "../../services/moviesApi";
import { useTranslation } from "react-i18next";
import ProtectedRoute from "../protected";
import PageHeadingComponent from "../components/pageHeadingComponent";

// Extracted the Pagination logic for reuse
const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();

  return (
    <nav aria-label="Movies Pagination">
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          as="span"
          className="nav-button"
        >
          <span style={{ color: currentPage === 1 ? "grey" : "" }}>
            {t("Prev")}
          </span>
        </Pagination.Prev>

        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          as="span"
          className="nav-button"
        >
          <span style={{ color: currentPage === totalPages ? "grey" : "" }}>
            {t("Next")}
          </span>
        </Pagination.Next>
      </Pagination>
    </nav>
  );
};

const MovieList = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const params = useMemo(
    () => ({
      pageNo: currentPage,
      pageSize: 8,
      fields: "id,title,publishing_year,poster",
      sortOrder: "id desc",
    }),
    [currentPage]
  );

  const {
    data: moviesData,
    error,
    isLoading,
    isFetching,
  } = useGetMoviesQuery(params);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handlePosterClick = (movie) => {
    router.push(`/movieList/modifyMovie/${movie.id}`);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
    router.push("/");
  };

  if (isLoading || isFetching) {
    return (
      <main>
        <section
          aria-label="Loading Movies"
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">{t("Loading...")}</span>
          </Spinner>
        </section>
      </main>
    );
  }

  if (error) {
    console.error("Error fetching movies:", error);
    return <main>{t("Error loading movies. Please try again later.")}</main>;
  }

  const totalMovies = moviesData?.length || 0;
  const totalPages = Math.ceil(totalMovies / params.pageSize);

  return (
    <main>
      <Container className="my-5 position-relative z-3">
        <header className="d-flex justify-content-between">
          <PageHeadingComponent
            title={t("My Movies")}
            Element={
              <PlusCircle
                style={{ cursor: "pointer" }}
                color="#fff"
                className="fs-6 pe-auto"
                onClick={() => router.push("/movieList/modifyMovie/0")}
              />
            }
          />

          <button
            className="btn text-white py-4 d-flex align-items-center gap-2"
            style={{
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
              outline: "none",
              boxShadow: "none",
              marginTop: "5px",
            }}
            onClick={handleLogout}
            aria-label="Logout"
          >
            <span className="d-none d-md-inline">{t("Log Out")}</span>
            <BoxArrowRight color="#fff" className="fs-6 pe-auto" />
          </button>
        </header>

        {totalMovies > 0 ? (
          <>
            <section aria-label="Movie List">
              <Row>
                {moviesData.map((movie) => (
                  <Col
                    key={movie.id}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={6}
                    onClick={() => handlePosterClick(movie)}
                  >
                    <MovieCard
                      title={movie.title}
                      year={movie.publishing_year}
                      imageSrc={movie.poster}
                    />
                  </Col>
                ))}
              </Row>
            </section>

            <footer className="pagination-wrapper app-bg-color">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </footer>
          </>
        ) : (
          <EmptyMovieList />
        )}
      </Container>
    </main>
  );
};

export default ProtectedRoute(MovieList);
