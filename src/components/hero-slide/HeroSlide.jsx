import React, { useState, useEffect, useRef } from 'react';

import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import Button, { OutlineButton } from '../button/Button';
import Modal, { ModalContent } from '../modal/Modal';

import tmdbApi, { category, movieType } from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';

import './hero-slide.scss';
import { useHistory } from 'react-router';

const HeroSlide = () => {

    SwiperCore.use([Autoplay]);

    const [movieItems, setMovieItems] = useState([]);
    const [embedUrl, setEmbedUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const getMovies = async () => {
            const params = { page: 1 };
            try {
                const response = await tmdbApi.getMoviesList(movieType.popular, { params });
                setMovieItems(response.results.slice(1, 4));
                console.log(response);
            } catch {
                console.log('error');
            }
        }
        getMovies();
    }, []);

    const openEmbedModal = (url) => {
        setEmbedUrl(url);
        setIsModalOpen(true);
    }

    return (
        <div className="hero-slide">
            <Swiper
                modules={[Autoplay]}
                grabCursor={true}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{ delay: 5000 }}  // Slowing down the slide animation
            >
                {
                    movieItems.map((item, i) => (
                        <SwiperSlide key={i}>
                            {({ isActive }) => (
                                <HeroSlideItem 
                                    item={item} 
                                    className={`${isActive ? 'active' : ''}`} 
                                    openEmbedModal={openEmbedModal}
                                />
                            )}
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            {
                movieItems.map((item, i) => <TrailerModal key={i} item={item} />)
            }
            {isModalOpen && 
                <Modal active={isModalOpen} id="embedModal" onClose={() => setIsModalOpen(false)}>
                    <ModalContent onClose={() => setIsModalOpen(false)}>
                        <iframe 
                            src={embedUrl} 
                            width="100%" 
                            height="500px" 
                            title="movie-embed"
                            frameBorder="0" 
                            allowFullScreen
                        ></iframe>
                    </ModalContent>
                </Modal>
            }
        </div>
    );
}

const HeroSlideItem = ({ item, className, openEmbedModal }) => {

    let history = useHistory();

    const background = apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path);

    const setModalActive = async () => {
        const modal = document.querySelector(`#modal_${item.id}`);

        const videos = await tmdbApi.getVideos(category.movie, item.id);

        if (videos.results.length > 0) {
            const videSrc = 'https://www.youtube.com/embed/' + videos.results[0].key;
            modal.querySelector('.modal__content > iframe').setAttribute('src', videSrc);
        } else {
            modal.querySelector('.modal__content').innerHTML = 'No trailer';
        }

        modal.classList.toggle('active');
    }

    const handleWatchNow = () => {
        const embedUrl = `https://vidsrc.to/embed/movie/${item.id}`;
        openEmbedModal(embedUrl);
    }

    return (
        <div
            className={`hero-slide__item ${className}`}
            style={{backgroundImage: `url(${background})`}}
        >
            <div className="hero-slide__item__content container">
                <div className="hero-slide__item__content__info">
                    <h2 className="title">{item.title}</h2>
                    <div className="overview">{item.overview}</div>
                    <div className="btns">
                        <Button onClick={handleWatchNow}>
                            Watch now
                        </Button>
                        <OutlineButton onClick={setModalActive}>
                            Watch trailer
                        </OutlineButton>
                    </div>
                </div>
                <div className="hero-slide__item__content__poster">
                    <img src={apiConfig.w500Image(item.poster_path)} alt="" />
                </div>
            </div>
        </div>
    )
}

const TrailerModal = ({ item }) => {
    const iframeRef = useRef(null);

    const onClose = () => iframeRef.current.setAttribute('src', '');

    return (
        <Modal active={false} id={`modal_${item.id}`}>
            <ModalContent onClose={onClose}>
                <iframe ref={iframeRef} width="100%" height="500px" title="trailer"></iframe>
            </ModalContent>
        </Modal>
    )
}

export default HeroSlide;
