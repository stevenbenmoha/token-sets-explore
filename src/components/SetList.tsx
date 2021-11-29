import {
    Card,
    CardActions,
    CardContent,
    Collapse,
    IconButton,
    IconButtonProps,
    styled,
} from '@mui/material';
import React from 'react';
import {DisplaySet} from "../classes/DisplaySet";
import "../styles/SetList.css"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


const SetList = ({setList}: { setList: DisplaySet }) => {

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div>
            <Card className="rounded-border" elevation={12}>
                        <CardContent className="unified-style card-header">
                            <div className="card-title">
                                {setList.name} - ${setList.symbol}
                            </div>
                            <div className="address">
                                Address:
                            </div>
                            <div className="address">
                                <a target="_blank" rel="noreferrer" href={'https://etherscan.io/address/' + setList.address}>{setList.address}</a>
                            </div>
                        </CardContent>
                        <CardActions disableSpacing>
                            <ExpandMore className="expand-button"
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more">
                                <ExpandMoreIcon/>
                            </ExpandMore>
                        </CardActions>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent className="graphik-font">
                                <div className="positions-header">
                                    Positions:
                                </div>
                                {setList.currentPositions.map((position, index) =>
                                    <div className="positions"><a target="_blank" rel="noreferrer" href={'https://etherscan.io/address/' + position.address}><img
                                        src={position.logoURI}
                                        alt="logo"
                                    /><span className="position-name">{position.name}</span></a></div>
                                )}
                            </CardContent>
                        </Collapse>
                    </Card>
        </div>
    )
};

export default SetList
