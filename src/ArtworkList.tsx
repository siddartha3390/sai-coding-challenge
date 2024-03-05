import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { FC } from 'react';
import Pagination from '@mui/material/Pagination';
import { useSearchParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';

interface Artwork {
   id: number;
   api_model: string;
   api_link: string;
   is_boosted: boolean;
   title: string;
   description: string
   thumbnail: {
      lqip: string
      alt_text: string
   }
}

interface Pagination {
   total: number;
   limit: number;
   offset: number;
   total_pages: number;
   current_page: number;
   next_url: string;
}

interface ArtworkListState {
   artworks: Artwork[];
   currentPage: number;
   totalPages: number;
}


interface ArtworkListProps {
}

const ArtworkList: FC<ArtworkListProps> = (props) => {
   const [state, setState] = useState<ArtworkListState>({
      artworks: [],
      currentPage: 1,
      totalPages: 0,
   });
   const [searchParams] = useSearchParams();
   const [searchTerm, setSearchTerm] = useState('');
   const [categoryFilter, setCategoryFilter] = useState('');
   const [categories, setCategories] = useState<{ id: string; title: string }[]>([]);

   useEffect(() => {
      const fetchArtworks = async () => {
         try {
           const response = await axios.get(`https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}&category_ids=${categoryFilter}&limit=10&page=${(state.currentPage)}`);
           setState({
            ...state,
            artworks: response.data.data,
            totalPages: response.data.pagination.total_pages,
         });
         } catch (error) {
           console.error("Failed to fetch artworks:", error);
         }
      };

      fetchArtworks();
   }, [state.currentPage, categoryFilter, searchTerm]);


   useEffect(() => {
      const fetchCategories = async () => {
        const response = await axios.get('https://api.artic.edu/api/v1/category-terms');
        setCategories(response.data.data);
      };
  
      fetchCategories();
   }, []);

   const handlePageChange = (pageNumber: number) => {
      setState({ ...state, currentPage: pageNumber });
   };


   const handleSearch = (event: any) => {
      setSearchTerm(event.target.value);
      searchParams.set('search', event.target.value);
   };
  
   const handleCategoryFilter = (event: any) => {
      setCategoryFilter(event.target.value);
      searchParams.set('category', event.target.value);
   };


   return (
      <Container fixed>
         <Box sx={{ bgcolor: 'background.default' }}>   
         <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search by title..." />
         <select value={categoryFilter} onChange={handleCategoryFilter}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.title}</option>
        ))}
      </select>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {state.artworks.map((artwork) => (
               <div key={artwork.id}>  
               <ListItem alignItems="flex-start">
               <Link href={`/artwork/${artwork.id}`}>
                  <ListItemAvatar>
                     <Avatar alt={artwork.thumbnail?.alt_text} src={artwork.thumbnail?.lqip} />
                  </ListItemAvatar>
               </Link>    

                  <ListItemText
                     primary={
                        <React.Fragment>
                           <Link href={`/artwork/${artwork.id}`}>
                           <Typography
                              gutterBottom
                              variant="h5"
                           >
                              { artwork.title}

                           </Typography>
                           </Link>
                        </React.Fragment>
                       }
                     secondary={
                        <React.Fragment>
                           <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                           >
                              { artwork.description && <div dangerouslySetInnerHTML={ {__html: artwork.description}} />}

                              
                           </Typography>
                        </React.Fragment>
                     }
                  />
               </ListItem>
                  <Divider variant="inset" component="li" />
               </div>
            ))}
         </List>

         <Pagination count={state.totalPages} page={state.currentPage} onChange={(e, page) => handlePageChange(page)} shape="rounded" />
         </Box>

      </Container>
   );
};

export default ArtworkList;
