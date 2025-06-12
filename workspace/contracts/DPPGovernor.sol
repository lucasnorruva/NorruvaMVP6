// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title DPPGovernor
 * @dev A UUPS upgradeable governor contract for the Norruva DPP platform.
 * It uses an ERC20Votes token (NORUToken) for voting and a TimelockController
 * for enforcing a delay on proposal execution.
 */
contract DPPGovernor is
    Initializable,
    GovernorUpgradeable,
    GovernorTimelockControlUpgradeable,
    GovernorVotesUpgradeable,
    GovernorVotesQuorumFractionUpgradeable,
    UUPSUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the Governor contract.
     * @param _token The address of the ERC20Votes token (NORUToken).
     * @param _timelock The address of the TimelockController contract.
     * @param _name The name of the Governor.
     */
    function initialize(
        IVotes _token,
        TimelockControllerUpgradeable _timelock,
        string memory _name
    ) public initializer {
        __Governor_init(_name);
        __GovernorTimelockControl_init(_timelock);
        __GovernorVotes_init(_token);
        __GovernorVotesQuorumFraction_init(4); // Default quorum: 4%
        __UUPSUpgradeable_init();

        // Grant DEFAULT_ADMIN_ROLE to this contract (Governor) itself to manage its own upgrades
        // This role is typically controlled by the DAO via proposals through the Timelock.
        _grantRole(DEFAULT_ADMIN_ROLE, address(this));
    }

    // --- Standard Governor Settings Overrides ---

    /**
     * @dev See {IGovernor-votingDelay}.
     * Sets the voting delay to 1 block.
     */
    function votingDelay() public view virtual override returns (uint256) {
        return 1; // 1 block
    }

    /**
     * @dev See {IGovernor-votingPeriod}.
     * Sets the voting period to ~1 day (assuming 12s block time).
     * 7200 blocks = 7200 * 12s = 86400s = 24 hours = 1 day
     */
    function votingPeriod() public view virtual override returns (uint256) {
        return 7200; // ~1 day
    }

    /**
     * @dev See {IGovernor-proposalThreshold}.
     * Sets the proposal threshold to 0, allowing anyone with voting power to propose.
     */
    function proposalThreshold() public view virtual override returns (uint256) {
        return 0;
    }

    /**
     * @dev See {IGovernor-quorum}.
     * Uses the quorum fraction defined by GovernorVotesQuorumFractionUpgradeable.
     */
    function quorum(uint256 blockNumber)
        public
        view
        virtual
        override(IGovernorUpgradeable, GovernorVotesQuorumFractionUpgradeable)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    // --- UUPS Upgradeability ---

    /**
     * @dev Authorizes an upgrade to a new implementation.
     * Restricted to an account with DEFAULT_ADMIN_ROLE (which is the Governor itself).
     */
    function _authorizeUpgrade(address newImplementation)
        internal
        virtual
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {}

    // --- Interface Support ---

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(GovernorUpgradeable, AccessControlEnumerableUpgradeable, GovernorTimelockControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // The following functions are overrides required by Solidity.

    function state(uint256 proposalId)
        public
        view
        virtual
        override(IGovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public virtual override(GovernorUpgradeable, IGovernorUpgradeable) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal virtual override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal virtual override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        virtual
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (address)
    {
        return super._executor();
    }
}
