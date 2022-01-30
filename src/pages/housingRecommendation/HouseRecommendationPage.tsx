import React from 'react';
import { withStyles, Paper, makeStyles, TableBody, TableRow, TableCell, Avatar, Grid, Typography, Slider,Toolbar, Dialog, DialogTitle, DialogActions, Button} from '@material-ui/core';
import useTable from '../../components/recommendation/useTable';
import APIService from "utils/ApiService";
import RecommendationContext from 'contexts/RecommendationContext';
import routes from 'constants/routes';
import { useHistory } from 'react-router-dom';
import { Icon } from '@iconify/react';


  interface House {
    company_id: String
    has_furnishing: String
    house_recommendation_id: String
    no_of_rooms: number
    house_id: String  //partition key
    no_of_toilets: number
    address: String
    nearest_mrt: String
    image_folder: String
    square_feet: number
    developer: String
    tenure: number
    price: number
    distance_to_mrt: number
    type: String
  }

  interface HeadCell {
    id: string;
    label: string;
    numeric: boolean;
  }

  const useStyles = makeStyles(theme => ({
    main: {
      padding: '4.5em 2em 9em 2em',
      overflow: 'hide'
    },
    iconGrid: {
      margin: '0 5% 0 1.5%',
      // border: '1px solid red'
    },
    icon: {
      verticalAlign: '-0.125em',
      marginLeft: '6px',
      fontSize: '24px'
    },
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)

    },
    pagination: {
      display: 'flex',
      alignItems: 'end',
      justifyContent: 'center',
    },
    tableRow: {
      "&:hover": {
        backgroundColor: "#e9daf7"
      }
    },
    button: {
      margin: '0 4px 0 4px',
      width: '11%',
      paddingTop: '1%',
      paddingBottom: '1%',
      borderRadius: '0px',
      backgroundColor: '#F64C72',
      color: 'black',
      "&:hover": {
          backgroundColor: '#FF5E81',
      }
    }, 
  }))

  const iOSBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

  const IOSSlider = withStyles({
    root: {
      color: '#242582',
      height: 2,
      padding: '15px 0',
    },
    thumb: {
      height: 28,
      width: 28,
      backgroundColor: '#9b73f0',
      boxShadow: iOSBoxShadow,
      marginTop: -14,
      marginLeft: -14,
      '&:focus,&:hover,&$active': {
        boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          boxShadow: iOSBoxShadow,
        },
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 11px)',
      top: -22,
      '& *': {
        background: '#9b73f0',
        color: '#000',
      },
    },
    track: {
      height: 3,
    },
    rail: {
      height: 2,
      opacity: 0.5,
      backgroundColor: '#bfbfbf',
    },
    // mark: {
    //   backgroundColor: '#bfbfbf',
    //   height: 8,
    //   width: 1,
    //   marginTop: -3,
    // },
    markActive: {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  })(Slider);



  const headCells: HeadCell[] = [
    { id: 'image_folder', label: '', numeric: false },
    { id: 'address', label: 'Address', numeric: false },
    { id: 'square_feet', label: 'Size (in square feet)', numeric: true },
    { id: 'no_of_rooms', label: 'No. of Rooms', numeric: true },
    { id: 'no_of_toilets', label: 'No. of Toilets', numeric: true },
    { id: 'price', label: 'House Price', numeric: true },
  ]


  /**
 * Housing Recommendation Component
 * Implements the Housing Recommendation ui.
 * @returns {JSX.Element}
 * 
 * @author Sokunthea
 */

const HouseRecommendation = () => {
    const classes = useStyles();
    const history = useHistory();
  
    React.useEffect(() => {
        const getHousesList = async () => {
            const response = await APIService.generateHousingRecommendationNoFilter();
            if (response){
                const houseList: House[] = response.body.houses;
                setHouses(houseList)
            }
        }
        getHousesList();
    },[]); //empty array represents an empty list of dependencies 
    

    const [houses, setHouses ] = React.useState<House[]>([]);
    const [page, setPage ] = React.useState(1);
    const [noMorePage, setNoMorePage] = React.useState<boolean> (false);
    const [open, setOpen] = React.useState<boolean>(false);
    const [priceRangeValue, priceRangeSetValue] = React.useState<number[]>([1, 999999999]);
    const [roomRangeValue, roomRangSeteValue] = React.useState<number[]>([1, 10]);;
    const [toiletRangeValue, toiletRangeSetValue] = React.useState<number[]>([1, 10]);;
    const [sizeRangeValue, sizeRangeSetValue] = React.useState<number[]>([10, 999999]);;
    const {setRecommendationState} =  React.useContext(RecommendationContext);
    const handlePriceChange = ( event: React.ChangeEvent<{}> , newValue: number | number[]) => {
      priceRangeSetValue(newValue as number[]);
    };
  
    const handleIncreasePage = () => {
      if (!noMorePage) {setPage(page+1)}
      else {handleClickNoMorePageOpen()}
    };

    const handleDecreasePage = () => {
      if (page>1) {setPage(page-1)}
      else {handleClickNoMorePageOpen()}
    };

    const handleRoomChange = ( event: React.ChangeEvent<{}> , newValue: number | number[]) => {
      roomRangSeteValue(newValue as number[]);
    };
  
    const handleToiletChange = ( event: React.ChangeEvent<{}> , newValue: number | number[]) => {
      toiletRangeSetValue(newValue as number[]);
    };
  
    const handleSizeChange = ( event: React.ChangeEvent<{}> , newValue: number | number[]) => {
      sizeRangeSetValue(newValue as number[]);
    };
    
    const handleClickNoMorePageOpen = () => {
        setOpen(true);
      };
    
    const handleNoMorePageClose = () => {
        setOpen(false);
      };

    React.useEffect(() => {
      const getHousesListFilter = async (page: number, priceRangeValue:Array<number> ,roomRangeValue:Array<number> ,toiletRangeValue:Array<number> ,sizeRangeValue:Array<number>) => {
          const response = await APIService.generateHousingRecommendationFilter(
            page,
            priceRangeValue[0],
            priceRangeValue[1],
            roomRangeValue[0],
            roomRangeValue[1],
            toiletRangeValue[0],
            toiletRangeValue[1],
            sizeRangeValue[0],
            sizeRangeValue[1],
          );
          if (response){
              const houseList: House[] = response.body.houses;
              console.log(houseList)
              setHouses(houseList)
              setNoMorePage(false)
          }
          else setNoMorePage(true)
      }
      getHousesListFilter(page, priceRangeValue, roomRangeValue,toiletRangeValue, sizeRangeValue);
    },[page, sizeRangeValue, roomRangeValue, toiletRangeValue, priceRangeValue]);

    const handleDetails = (item:any) => {
      console.log("item to pass:");
      console.log(item);
      setRecommendationState({type:'house', data:{...item}});
      history.push(routes.DESCRIPTION)
    };

    const FilterBar = () => {
      return (
        <div>
          <Grid container spacing={5}>
            <Grid item lg={3} sm={6} xl={3} xs={12} >
              <Typography id="range-slider">
                Size Range (in square feet)
              </Typography>
              <IOSSlider
                  getAriaLabel={() => 'Size range'}
                  value={sizeRangeValue}
                  onChange={handleSizeChange}
                  valueLabelDisplay="auto"
                  min={1}
                  max={999999}
              />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}  >
                No. of Bedrooms  
              <Icon icon="icon-park-outline:double-bed" className={classes.icon}/>
              <IOSSlider
                  getAriaLabel={() => 'Room range'}
                  value={roomRangeValue}
                  onChange={handleRoomChange}
                  valueLabelDisplay="auto"
                  min={1}
                  max={10}
              />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12} >
                No. of Bathrooms
              <Icon icon="fa:bath" className={classes.icon} />
              <IOSSlider
                   getAriaLabel={() => 'Toilet range'}
                   value={toiletRangeValue}
                   onChange={handleToiletChange}
                   valueLabelDisplay="auto"
                   min={1}
                   max={10}
              />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12} >
                Price Range
              <Icon icon="dashicons:money-alt" className={classes.icon} />
              <IOSSlider
                  getAriaLabel={() => 'Price range'}
                  value={priceRangeValue}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={value => <div>{value}</div>}
                  min={1}
                  max={99999999}
              />
            </Grid>
          </Grid>
        </div>
      )
    };
  
   
    const {
      TblContainer,
      TblHead,
      recordsAfterPagingAndSorting
    } = useTable(houses, headCells);


    return (
      <div className={classes.main}>
        <Paper className={classes.pageContent}>
          <h1 style={{textAlign: "left" }}> Your Housing Recommendation </h1>
          <FilterBar/>
          <TblContainer>
            <TblHead />
              <TableBody>
                 {
                  recordsAfterPagingAndSorting().map((item:any) =>
                    (
                      <TableRow hover key={item.id} className={classes.tableRow} onClick={() => handleDetails(item)}>
                        <TableCell> <Avatar variant={"square"} alt="The image" src= {item.image_folder +"1.jpg" } style={{width: 200, height: 100}} /> </TableCell>
                        <TableCell> <span style={{fontSize:"1.2em" , fontWeight:'bold'}} > {item.type} </span> <br/> {item.address}</TableCell>
                        <TableCell>{item.square_feet}</TableCell>
                        <TableCell>{item.no_of_rooms}</TableCell>
                        <TableCell>{item.no_of_toilets}</TableCell>
                        <TableCell>{item.price}</TableCell>
                      </TableRow>
                    
                    )
                  )
                  }
              </TableBody>
          </TblContainer>
          <Toolbar className={classes.pagination}>
              <Button className={classes.button} onClick={handleDecreasePage}>
                Back 
              </Button>
              <Button className={classes.button} onClick={handleIncreasePage}>
                Next Page
              </Button>
              <Dialog open={open} onClose={handleNoMorePageClose} >
                <DialogTitle> No More Pages</DialogTitle>
                <DialogActions>
                  <Button onClick={handleNoMorePageClose}>Back</Button>
                </DialogActions>
              </Dialog>
            </Toolbar>
        </Paper>

      </div>
    );
}

export default HouseRecommendation;