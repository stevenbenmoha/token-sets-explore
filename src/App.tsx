// src/App.js

import React, {Component} from 'react';
import Set from "set.js";
import {
    basicIssuanceModuleAddress, basicIssuanceModuleAddressTest,
    controllerAddress, controllerAddressTest,
    debtIssuanceModuleAddress, debtIssuanceModuleAddressTest, debtIssuanceModuleV2AddressTest,
    governanceModuleAddress, governanceModuleAddressTest,
    masterOracleAddress, masterOracleAddressTest,
    navIssuanceModuleAddress, navIssuanceModuleAddressTest,
    protocolViewerAddress, protocolViewerAddressTest,
    setTokenCreatorAddress, setTokenCreatorAddressTest,
    streamingFeeModuleAddress, streamingFeeModuleAddressTest,
    tradeModuleAddress, tradeModuleAddressTest
} from "./constants/ethContractAddresses";
import {infuraKovanUrl, infuraMainnetUrl} from "./constants/web3Providers";
import {defiPulseAddress, layerTwoAddress, MAINNET, metaverseAddress, walletAddress} from "./constants/tokens";
import {DisplaySet, Position} from "./classes/DisplaySet";
import SetList from "./components/SetList";
import tokenList from "./constants/ethereum.tokenlist.json"
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent
} from '@mui/material';

const Web3 = require('web3');

class App extends Component {

    web3: any;
    mainConfig: any;
    setObject: any;
    setToken: any;
    systemAPI: any;
    networkSelection = MAINNET;
    defaultTokenSets = [defiPulseAddress, metaverseAddress, layerTwoAddress];
    tokenSets: any;
    displayedSets: DisplaySet[] = [];
    showSets = false;
    showErrorMsg = false;

    state = {
        setList: this.displayedSets
    }

    render() {
        if (this.showSets) {
            return (
                <div>
                    <div>
                        <Card className="rounded-border card" elevation={20}>
                            <CardContent className="unified-style logo-header">
                                <img src="https://www.tokensets.com/static/media/set-and-tokensets-logo.872a2884.svg"
                                     alt="logo"
                                     className="graphik-font page-title"/>
                                <Card className="rounded-border selector" elevation={4}>
                                    <CardContent className="unified-style logo-header">
                                        <FormControl fullWidth>
                                            <Select className="select-dropdown network-font"
                                                    variant="standard"
                                                    disableUnderline={true}
                                                    defaultValue={this.networkSelection}
                                                    name="networkSelection"
                                                    onChange={e => this.handleChange(e)}
                                            >
                                                <MenuItem value={"Mainnet"}>Mainnet</MenuItem>
                                                <MenuItem value={"Kovan"}>Kovan</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </div>
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        '& > :not(style)': {
                            m: 3,
                            width: 400,
                            height: 250,
                        },
                        justifyContent: 'center'
                    }}>
                        <br/>
                        <SetList
                            setList={new DisplaySet(this.displayedSets[0].name, this.displayedSets[0].symbol, this.displayedSets[0].address, this.displayedSets[0].currentPositions)}/>
                        <SetList
                            setList={new DisplaySet(this.displayedSets[1].name, this.displayedSets[1].symbol, this.displayedSets[1].address, this.displayedSets[1].currentPositions)}/>
                        <SetList
                            setList={new DisplaySet(this.displayedSets[2].name, this.displayedSets[2].symbol, this.displayedSets[2].address, this.displayedSets[2].currentPositions)}/>
                    </Box>
                </div>
            );
        } else if (!this.showSets && !this.showErrorMsg) {
            return (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 50
                }}>
                    <CircularProgress/>
                </Box>
            );
        } else {
            return (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 50
                }}>
                    <p className="error-msg"> Call Failure, Please Refresh And Try Again</p>
                </Box>
            );
        }
    }

    async componentDidMount() {
        await this.instantiateSetToken();
        await this.mapSetDetailsToDisplaySets();
        await this.setChildState();
    }

    private handleChange(event: SelectChangeEvent) {
        this.networkSelection = event.target.value as string;
        this.hideSetsAndResetPage();
        this.componentDidMount();
    }

    private async instantiateSetToken() {
        if (this.networkSelection === MAINNET) {
            this.web3 = new Web3(infuraMainnetUrl);
            this.mainConfig = {
                web3Provider: this.web3.currentProvider,
                basicIssuanceModuleAddress: basicIssuanceModuleAddress,
                controllerAddress: controllerAddress,
                masterOracleAddress: masterOracleAddress,
                navIssuanceModuleAddress: navIssuanceModuleAddress,
                protocolViewerAddress: protocolViewerAddress,
                setTokenCreatorAddress: setTokenCreatorAddress,
                streamingFeeModuleAddress: streamingFeeModuleAddress,
                tradeModuleAddress: tradeModuleAddress,
                debtIssuanceModuleAddress: debtIssuanceModuleAddress,
                debtIssuanceModuleV2Address: debtIssuanceModuleAddress,
                governanceModuleAddress: governanceModuleAddress
            }
        } else {
            this.web3 = new Web3(infuraKovanUrl);
            this.mainConfig = {
                web3Provider: this.web3.currentProvider,
                basicIssuanceModuleAddress: basicIssuanceModuleAddressTest,
                controllerAddress: controllerAddressTest,
                masterOracleAddress: masterOracleAddressTest,
                navIssuanceModuleAddress: navIssuanceModuleAddressTest,
                protocolViewerAddress: protocolViewerAddressTest,
                setTokenCreatorAddress: setTokenCreatorAddressTest,
                streamingFeeModuleAddress: streamingFeeModuleAddressTest,
                tradeModuleAddress: tradeModuleAddressTest,
                debtIssuanceModuleAddress: debtIssuanceModuleAddressTest,
                debtIssuanceModuleV2Address: debtIssuanceModuleV2AddressTest,
                governanceModuleAddress: governanceModuleAddressTest
            }
        }
        this.setObject = new Set(this.mainConfig);
        this.setToken = this.setObject.setToken;
        this.systemAPI = this.setObject.system;
    }

    private async mapSetDetailsToDisplaySets() {

        if (this.networkSelection === MAINNET) {
            this.tokenSets = this.defaultTokenSets;
        } else {
            this.tokenSets = await this.fetchThreeKovanSets();
        }

        for (const set of this.tokenSets) {
            await this.fetchSetDetails(set, walletAddress).then(async res => {
                const positionAddresses: string[] = [];
                res.positions.forEach((pos: string[]) => {
                    positionAddresses.push(pos[0]);
                })
                const positionsObj = await this.fetchTokenPositionList(positionAddresses);
                this.displayedSets.push(new DisplaySet(res.name, res.symbol, set, positionsObj));
            });
        }
    }

    private async setChildState() {
        await this.setState({setList: this.displayedSets});
        this.showSets = true;
        await this.forceUpdate();
    }

    private async fetchSetDetails(setAddress: string, callerAddress: string): Promise<any> {
        if (this.setToken) {
            try {
                const modules = await this.setToken.getModulesAsync(setAddress, callerAddress);
                return await this.setToken.fetchSetDetailsAsync(setAddress, modules, callerAddress);
            } catch (e) {
                this.showErrorMsg = true;
                this.forceUpdate();
                throw Error;
            }
        }
    }

    private async fetchTokenPositionList(positions: string[]) {

        const fullPositionList: any[] = [];

        // For each address, fetch the name and logo from a hashmap created from json file of coingecko tokens
        for (const address of positions) {
            if (this.networkSelection === MAINNET) {
                const array = tokenList.tokens;
                const result = new Map<String, String>(array.map(obj => [obj.address.toLowerCase(), obj.name + '^' + obj.logoURI]));
                let mapEntryPosition = result.get(address.toLowerCase());

                if (mapEntryPosition) {
                    //  To avoid complex multi-value map, both name and logo stored in value. extracted below:
                    const name = mapEntryPosition.split('^')[0];
                    const logoURI = mapEntryPosition.split('^')[1];
                    fullPositionList.push(new Position(name, address.toLowerCase(), logoURI));
                }
            } else {
                const name = await this.setObject.erc20.getTokenNameAsync(address, walletAddress);
                console.log('Name: ', name);
                fullPositionList.push(new Position(name, address.toLowerCase(), "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png?1595348880"));
            }
        }
        return fullPositionList;
    }

    private hideSetsAndResetPage() {
        this.showSets = false;
        this.forceUpdate();
        this.displayedSets = [];
        this.tokenSets = [];
    }

    private async fetchThreeKovanSets(): Promise<any> {
        const kovanSets = [];
        const sets = await this.systemAPI.getSetsAsync(walletAddress);
        for (let i = 0; i < 3; i++) {
            kovanSets.push(sets[i * 25]);
        }
        return kovanSets;
    }
}

export default App;
