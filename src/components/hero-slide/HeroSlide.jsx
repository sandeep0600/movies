import React, { useState, useEffect, useRef } from 'react';
import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useHistory } from 'react-router-dom';
import Button, { OutlineButton } from '../button/Button';
import Modal, { ModalContent } from '../modal/Modal';
import tmdbApi, { category, movieType } from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';
import 'swiper/swiper-bundle.min.css';
import './hero-slide.scss';

SwiperCore.use([Autoplay]);

const HeroSlide = () => {
    const [movieItems, setMovieItems] = useState([]);

    useEffect(() => {
        const getMovies = async () => {
            const params = { page: 1 };
            try {
                const response = await tmdbApi.getMoviesList(movieType.popular, { params });
                setMovieItems(response.results.slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch movie list:', error);
            }
        };
        getMovies();
    }, []);

    return (
        <div className="hero-slide">
            <Swiper
                modules={[Autoplay]}
                grabCursor={true}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{ delay: 3000 }}
            >
                {movieItems.map((item, i) => (
                    <SwiperSlide key={i}>
                        {({ isActive }) => (
                            <HeroSlideItem item={item} className={isActive ? 'active' : ''} />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
            {movieItems.map((item, i) => <TrailerModal key={i} item={item} />)}
        </div>
    );
};

const HeroSlideItem = ({ item, className }) => {
    const history = useHistory();
    const [modalUrl, setModalUrl] = useState('');
    const [modalId, setModalId] = useState(null);

    const background = apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path);

    const setModalActive = async () => {
        const modal = document.querySelector(`#modal_${item.id}`);

        try {
            const videos = await tmdbApi.getVideos(category.movie, item.id);
            if (videos.results.length > 0) {
                const videoSrc = 'https://www.youtube.com/embed/' + videos.results[0].key;
                modal.querySelector('.modal__content > iframe').setAttribute('src', videoSrc);
            } else {
                modal.querySelector('.modal__content').innerHTML = 'No trailer';
            }
            modal.classList.toggle('active');
        } catch (error) {
            console.error('Failed to fetch videos:', error);
            modal.querySelector('.modal__content').innerHTML = 'No trailer available';
        }
    };

    const getWatchNowUrl = (item) => {
        if (item.imdb_id) {
            return `https://vidsrc.xyz/embed/movie?imdb=${item.imdb_id}`;
        } else if (item.id) {
            return `https://vidsrc.xyz/embed/movie?tmdb=${item.id}`;
        } else {
            return '';
        }
    };

    const handleWatchNowClick = () => {
        const url = getWatchNowUrl(item);
        if (url) {
            setModalUrl(url);
            setModalId(`video_modal_${item.id}`);
            document.querySelector(`#video_modal_${item.id}`).classList.add('active');
        }
    };

    return (
        <div
            className={`hero-slide__item ${className}`}
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className="hero-slide__item__content container">
                <div className="hero-slide__item__content__info">
                    <h2 className="title">{item.title}</h2>
                    <div className="overview">{item.overview}</div>
                    <div className="btns">
                        <Button onClick={handleWatchNowClick}>
                            Watch now
                        </Button>
                        <OutlineButton onClick={setModalActive}>
                            Watch trailer
                        </OutlineButton>
                    </div>
                </div>
                <div className="hero-slide__item__content__poster">
                    <img src={apiConfig.w500Image(item.poster_path)} alt={item.title} />
                </div>
            </div>
            <VideoModal id={`video_modal_${item.id}`} url={modalUrl} />
        </div>
    );
};

const TrailerModal = ({ item }) => {
    const iframeRef = useRef(null);

    const onClose = () => {
        if (iframeRef.current) {
            iframeRef.current.setAttribute('src', '');
        }
    };

    return (
        <Modal active={false} id={`modal_${item.id}`}>
            <ModalContent onClose={onClose}>
                <iframe ref={iframeRef} width="100%" height="500px" title="trailer"></iframe>
            </ModalContent>
        </Modal>
    );
};

const VideoModal = ({ id, url }) => {
    const iframeRef = useRef(null);

    const onClose = () => {
        if (iframeRef.current) {
            iframeRef.current.setAttribute('src', '');
        }
    };

    return (
        <Modal active={false} id={id}>
            <ModalContent onClose={onClose}>
                <iframe ref={iframeRef} width="100%" height="500px" title="video" src={url}></iframe>
            </ModalContent>
        </Modal>
    );
};

export default HeroSlide;
