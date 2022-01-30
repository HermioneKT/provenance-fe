import {
  Box,
  Container,
  Typography
} from '@material-ui/core';


/**
 * NotFound Component
 * Implements the 404 Page Not Found ui.
 * @returns {JSX.Element}
 * 
 * @author Lim Yan Kai
 */
const NotFound = () => (
  <>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: "200px"
      }}
    >
      <Container maxWidth="md">
        <Typography
          align="center"
          color="textPrimary"
          variant="h2"
        >
          404: The page you are looking for isn’t here
        </Typography>
      </Container>
    </Box>
  </>
);

export default NotFound;