import React, { useRef, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import slides from './slides'; 

const SlideShow = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current) {
        swiperRef.current.scrollBy(1, true);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Swiper
      ref={swiperRef}
      style={styles.wrapper} 
      showsButtons={false}
      autoplay
      autoplayInterval={3000} 
      loop
    >
      {slides.map((slide) => (
        <View key={slide.id}>
          <Image source={slide.image} style={styles.image} />
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {height: 150,},
  image: {
    width: '100%',
    height: 150,
  },
});

export default SlideShow;
