// ArtworkDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface Artwork {
   id: number;
   title: string;
   artist_display: string;
   date_display: string;
   main_reference_number: string;
   thumbnail: {
      lqip: string;
      width: number;
      height: number;
      alt_text: string;
   };
   dimensions: string;
}
interface Styles {
   container: React.CSSProperties;
   title: React.CSSProperties;
   image: React.CSSProperties;
   details: React.CSSProperties;
}

const ArtworkDetail: FC = () => {
   const [artwork, setArtwork] = useState<Artwork | null>(null);

   const { id } = useParams<{ id: string }>();

   const styles = {
      container: {
         display: 'flex',
         flexDirection: 'column' as const,
         alignItems: 'center',
         margin: '20px',
      },
      title: {
         fontSize: '24px',
         fontWeight: 'bold',
         marginBottom: '10px',
      },
      image: {
         width: '200px',
         height: 'auto',
         marginBottom: '20px',
      },
      details: {
         fontSize: '16px',
         textAlign: 'center' as const,
         marginBottom: '10px',
      },
   };


   useEffect(() => {
      const fetchArtwork = async () => {
         const response = await axios.get(`https://api.artic.edu/api/v1/artworks/${id}`);
         setArtwork(response.data.data);
      };

      fetchArtwork();
   }, [id]);

   if (!artwork) {
      return <div>Loading...</div>;
   }

   return (
      <Box component="section" display="flex"
         alignItems="center"
         gap={2}
         flexDirection="column"
      >
         <Typography
            gutterBottom
            variant="h5"
         >
            {artwork.title}

         </Typography>
         <img src={artwork.thumbnail.lqip} alt={artwork.title} style={styles.image} />
         <Typography sx={styles.details}>{artwork.artist_display}</Typography>
         <Typography sx={styles.details}>{artwork.date_display}</Typography>
         <Typography sx={styles.details}>{artwork.main_reference_number}</Typography>
         <Typography sx={styles.details}>{artwork.dimensions}</Typography>
         <Button variant="contained" href="/" >
            Go Back
         </Button>
      </Box>

   );
};

export default ArtworkDetail;
