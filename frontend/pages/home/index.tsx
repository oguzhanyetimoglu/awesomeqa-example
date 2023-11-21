import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Grid } from '@mui/material';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import NavigateButton from '../../components/NavigateButton';
import styles from './home.module.css';



const Home: NextPage = () => {
  const router = useRouter();

  const handleClick = async () => {
    router.push("/tickets");
  };
  return (
    <Box className={styles.boxContainer}>
      <Grid className={styles.gridContainer}>
        <NavigateButton
          text="Knowledge Base"
          icon={<LibraryBooksOutlinedIcon className={styles.homeIcon} />}
          handleClick={undefined}
        />
        <NavigateButton
          text="Tickets"
          icon={<SupportAgentIcon className={styles.homeIcon} />}
          handleClick={handleClick}
        />
        <NavigateButton
          text="FAQ Insights"
          icon={<LightbulbOutlinedIcon className={styles.homeIcon} />}
          handleClick={undefined}
        />
      </Grid>
    </Box>
  );
}

export default Home;
