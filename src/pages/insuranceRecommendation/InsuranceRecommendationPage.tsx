import React from 'react';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Avatar, Button, MenuItem, Menu,Toolbar, Dialog, DialogTitle, DialogActions} from '@material-ui/core';
import useTable from '../../components/recommendation/useTable';
import APIService from "utils/ApiService";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import RecommendationContext from 'contexts/RecommendationContext';
import routes from 'constants/routes';
import { useHistory } from 'react-router-dom';


  interface Plan {
    plan_id: String
    company_id: String
    document_folder: String
    max_renumeration_amount: number
    plan_name: String  
    policy_term: number
    type: String
    premium_min: number
    contact_number: number
    square_feet: number
    description: String
    url: string
    email: string
    name: string
    logo_url: String
    company_address: string
    company_type: String
  }

  interface HeadCell {
    id: string;
    label: string;
  }

  const useStyles = makeStyles(theme => ({
    main: {
      padding: '4.5em 2em 9em 2em',
    },

    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3),
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

  const headCells: HeadCell[] = [
    { id: 'logo_url', label: ''},
    { id: 'name', label: 'Name'},
    { id: 'type', label: 'Type'},
    { id: 'premium_max', label: 'Max Premium'},
  ]

/**
 * Insurance Recommendation Component
 * Implements the Insurance Recommendation ui.
 * @returns {JSX.Element}
 * 
 * @author Sokunthea
 */

const InsuranceRecommendation = () => {
    const classes = useStyles();
    const history = useHistory();
  
    React.useEffect(() => {
        const getPlansList = async () => {
            const response = await APIService.generateInsuranceRecommendationNoFilter();
            if (response){
                console.log("there is some data")
                const planList: Plan[] = response.body.plans;
                console.log(planList)
                setPlans(planList)
            }
        }
        getPlansList();
    },[]); //empty array represents an empty list of dependencies 
    

    const [plans, setPlans ] = React.useState<Plan[]>([]);
    const [page, setPage ] = React.useState(1);
    const [noMorePage, setNoMorePage] = React.useState<boolean> (false);
    const [open, setOpen] = React.useState<boolean>(false);
    const {setRecommendationState} =  React.useContext(RecommendationContext);
    const [type, setType] = React.useState<string>('');
    
    
    const handleIncreasePage = () => {
      if (!noMorePage) {setPage(page+1)}
      else {handleClickNoMorePageOpen()}
    };

    const handleDecreasePage = () => {
      if (page>1) {setPage(page-1)}
      else {handleClickNoMorePageOpen()}
    };

    const handleClickNoMorePageOpen = () => {
      setOpen(true);
    };
  
  const handleNoMorePageClose = () => {
      setOpen(false);
    };

    const handleTypeChange = (newType: string) => {
      setType(newType as string)
    };

    React.useEffect(() => {
      const getHousesListFilter = async (page: number, type: string) => {
          const response = await APIService.generateInsuranceRecommendationFilter(page, type);
          if (response){
              const planList: Plan[] = response.body.plans;
              console.log(planList)
              setPlans(planList)
              setNoMorePage(false)
          }
          else setNoMorePage(true)
          
      }
      getHousesListFilter(page, type);
    },[page, type]);

    const handleDetails = (item:any) => {
      console.log("item to pass:");
      console.log(item);
      setRecommendationState({type:'insurance', data:{...item}});
      history.push(routes.DESCRIPTION)
    };

    const FilterBar = () => {
      return (
        <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <Button variant="contained" color='primary' {...bindTrigger(popupState)}>
              Choose Insurance Type
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={(event)=> [ handleTypeChange('Life'), popupState.close]}>Life</MenuItem>
              <MenuItem onClick={(event)=> [ handleTypeChange('Hospitalisation'), popupState.close]}>Hospitalisation</MenuItem>
              <MenuItem onClick={(event)=> [ handleTypeChange('Critical Illness'), popupState.close]}>Critical Illness</MenuItem>
              <MenuItem onClick={(event)=> [ handleTypeChange('Disability'), popupState.close]}>Disability</MenuItem>
              <MenuItem onClick={(event)=> [ handleTypeChange('All'), popupState.close]}>All</MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
      )
    };
  
   
    const {
      TblContainer,
      TblHead,
      recordsAfterPagingAndSorting
    } = useTable(plans, headCells);


    return (
      <div className={classes.main}>
        <Paper className={classes.pageContent}>

          <h1 style={{textAlign: "left" }}> Your Insurance Recommendation </h1>
          <FilterBar/>
          <TblContainer>
            <TblHead />
              <TableBody>
                 {
                  recordsAfterPagingAndSorting().map((item:any) => (
                      <TableRow hover key={item.id} className={classes.tableRow} onClick={() => handleDetails(item)}>
                      <TableCell> <Avatar variant={"square"} alt="The image" src= {item.logo_url} style={{width: 200, height: 100}} /> </TableCell>
                      <TableCell> <span style={{fontSize:"1.2em" , fontWeight:'bold'}} > {item.name} </span> <br/> {item.type}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.premium_max}</TableCell>
                    </TableRow>)
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
export default InsuranceRecommendation;