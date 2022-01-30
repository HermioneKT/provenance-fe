import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';
import { CssBaseline } from '@mui/material';
import { Icon } from '@iconify/react';
import Carousel from 'react-material-ui-carousel'
import React from 'react';


const useStyles = makeStyles((theme) => ({
  paneGrid: {
    height: '77.3vh',
  },
  outerPaperGrid: {
    height: '77.3vh',
  },
  outerPaper: {
    height: '100%',
    padding: '18px 9% 3% 9%',
    borderRadius: '10px',
    overflow: 'auto',
  },
  lineGrid: {
    textAlign: 'left',
    alignItems: 'center',
    marginTop: '9px',
    marginBottom: '18px',
  },
  itemDescriptionText: {
    fontWeight: 'bold',
  },
  iconGrid: {
    margin: '0 5% 0 1.5%',
  },
  icon: {
    verticalAlign: '-0.125em',
    marginLeft: '6px',
    fontSize: '24px'
  },
  innerPaper: {
    padding: '8px 0 16px 0',
    marginBottom: '5px',
    elevation: 4
  },
  centerGrid: {
    marginTop: '8px',
    justifyContent: 'center',
  },
  carousel: {
    maxWidth: '75%',
  },
  carouselImage: {
    maxWidth: '100%',
    maxHeight: '10%',
  },
  detailsGrid: {
    marginTop: '15px',
    padding: '0 2.5% 0 2.5%',
  },
  detailNameGrid: {
    textAlign: 'left',
    alignItems: 'center',
    wordWrap: 'break-word',
  },
  detailNameText: {
    fontWeight: 'bold',
    fontSize: '0.86rem',
  },
  detailValueGrid: {
    paddingLeft: '1%',
    margin: 'auto',
    textAlign: 'left',
    alignItems: 'center',
    wordWrap: 'break-word',
  },
  detailValueText: {
    marginLeft: '14px',
    fontSize: 'small',
  },
}))


/**
 * DescriptionLeftPane Component
 * Implements the Housing/Insurance Description Left Pane ui.
 * @returns {JSX.Element}
 * 
 * @author Lim Her Huey
 */
const DescriptionLeftPane = (props: any) => {
  const classes = useStyles();

  const images = [props.data.image_folder + "1.jpg", props.data.image_folder + "2.jpg"];

  return (
    <div>
      <CssBaseline />
      <Grid container spacing={0} className={classes.paneGrid}>
        <Grid item xs={12} className={classes.outerPaperGrid}>
          <Paper className={classes.outerPaper}>
            <Grid item className={classes.lineGrid}>
              <Typography component="h1" variant="h5" className={classes.itemDescriptionText}>
                { props.data.item_type === "house" ? 
                  props.data.no_of_rooms + " Room " + props.data.type :
                  props.data.plan_name
                }
              </Typography>
            </Grid>
            <Grid container spacing={0} className={classes.lineGrid}>
              <Grid item className={classes.iconGrid}>
                { props.data.item_type === "house" ? 
                  props.data.no_of_rooms :
                  props.data.policy_term + " Years"
                }
                { props.data.item_type === "house" ? 
                  <Icon icon="icon-park-outline:double-bed" className={classes.icon} /> :
                  <Icon icon="mdi:calendar-month" className={classes.icon} />
                }
              </Grid>
              <Grid item className={classes.iconGrid}>
                { props.data.item_type === "house" ? 
                  props.data.no_of_toilets :
                  "$" + Number(props.data.premium_max).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                }
                { props.data.item_type === "house" ? 
                  <Icon icon="fa:bath" className={classes.icon} /> :
                  <Icon icon="bi:exclamation-circle-fill" className={classes.icon} />
                }
              </Grid>
              <Grid item className={classes.iconGrid}>
                
                { props.data.item_type === "house" ? 
                  "$" + Number(props.data.price).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') :
                  "$" + Number(props.data.max_renumeration_amount).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                }
                { props.data.item_type === "house" ? 
                  <Icon icon="dashicons:money-alt" className={classes.icon} /> :
                  <Icon icon="mdi:shield-star" className={classes.icon} />
                }
              </Grid>
            </Grid>

            <Grid item>
              <Paper className={classes.innerPaper}>
                { props.data.item_type === "house" ? 
                  <Grid container direction="row" alignItems="center" className={classes.centerGrid}>
                    <Carousel className={classes.carousel}>
                      {
                        images.map( image =>
                          <Paper>
                            <img src={image} className={classes.carouselImage} />
                          </Paper>
                        ) 
                      }
                    </Carousel>
                  </Grid> :
                  <Grid container />
                }

                <Grid container className={classes.detailsGrid}>
                  <Grid item xs={4} className={classes.detailNameGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailNameText}>
                      Type
                    </Typography>
                  </Grid>
                  <Grid item xs={8} className={classes.detailValueGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailValueText}>
                      {props.data.type}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className={classes.detailsGrid}>
                  <Grid item xs={4} className={classes.detailNameGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailNameText}>
                      { props.data.item_type === "house" ? 
                        "Area" :
                        "Policy Term"
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={8} className={classes.detailValueGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailValueText}>
                      { props.data.item_type === "house" ? 
                        props.data.square_feet + " sqft" :
                        props.data.policy_term + " years"
                      }
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className={classes.detailsGrid}>
                  <Grid item xs={4} className={classes.detailNameGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailNameText}>
                      { props.data.item_type === "house" ? 
                        "Furnishing" :
                        "Maximum Renumeration Amount"
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={8} className={classes.detailValueGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailValueText}>
                      { props.data.item_type === "house" ? 
                        (props.data.has_furnishing ? "Full" : (props.data.has_furnishing === "partially" ? "Partial" : "None")) :
                        "$" + Number(props.data.max_renumeration_amount).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                      }
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className={classes.detailsGrid}>
                  <Grid item xs={4} className={classes.detailNameGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailNameText}>
                      { props.data.item_type === "house" ? 
                        "Address" :
                        "Maximum Premium"
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={8} className={classes.detailValueGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailValueText}>
                      { props.data.item_type === "house" ? 
                        props.data.address :
                        "$" + Number(props.data.premium_max).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                      }
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className={classes.detailsGrid}>
                  <Grid item xs={4} className={classes.detailNameGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailNameText}>
                      { props.data.item_type === "house" ? 
                        "Distance to MRT" :
                        "Minimum Premium"
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={8} className={classes.detailValueGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailValueText}>
                      { props.data.item_type === "house" ? 
                        props.data.distance_to_mrt + " km" :
                        "$" + Number(props.data.premium_min).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                      }
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className={classes.detailsGrid}>
                  <Grid item xs={4} className={classes.detailNameGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailNameText}>
                      { props.data.item_type === "house" ? 
                        "Nearest MRT" :
                        "Brochure"
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={8} className={classes.detailValueGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailValueText}>
                      { props.data.item_type === "house" ? 
                        props.data.nearest_mrt :
                        <a target="_blank" href={props.data.document_folder}>Link</a>
                      }
                    </Typography>
                  </Grid>
                </Grid>
            { props.data.item_type === "house" ?
              <Grid container>
                <Grid container className={classes.detailsGrid}>
                  <Grid item xs={4} className={classes.detailNameGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailNameText}>
                      Tenure
                    </Typography>
                  </Grid>
                  <Grid item xs={8} className={classes.detailValueGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailValueText}>
                      {props.data.tenure} years
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className={classes.detailsGrid}>
                  <Grid item xs={4} className={classes.detailNameGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailNameText}>
                      Developer
                    </Typography>
                  </Grid>
                  <Grid item xs={8} className={classes.detailValueGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailValueText}>
                      {props.data.developer}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            : <Grid container /> }
                <Grid container className={classes.detailsGrid}>
                  <Grid item xs={4} className={classes.detailNameGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailNameText}>
                      Contact
                    </Typography>
                  </Grid>
                  <Grid item xs={8} className={classes.detailValueGrid}>
                    <Typography component="h1" variant="body1" className={classes.detailValueText}>
                      {props.data.email}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default DescriptionLeftPane
