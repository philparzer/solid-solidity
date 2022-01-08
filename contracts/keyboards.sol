// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Keyboards {

    enum KeyboardSize { 
	    SixtyPercent, 
	    SeventyFivePercent,
        EightyPercent, 
	    Iso105 
	}

    struct Keyboard {
        KeyboardSize size; //form factor
        bool isPBT; //true: PBT, false: ABS
        string filter; //tailwindcss color filter
        address owner;
    }

    event KeyboardCreated(
        Keyboard keyboard
    );

    event TipSent(
        address recipient,
        uint256 amount
    );


    Keyboard[] public createdKeyboards;

    function getKeyboards() view public returns(Keyboard[] memory) {
        return createdKeyboards;
    }

    function create(KeyboardSize _size, bool _isPBT, string calldata _filter) external {
        Keyboard memory newKeyboard = Keyboard(_size, _isPBT, _filter, msg.sender);
        createdKeyboards.push(newKeyboard);
        emit KeyboardCreated(newKeyboard);
    }

    function tipCreator(uint256 _index) external payable {
        address payable owner = payable(createdKeyboards[_index].owner);
        owner.transfer(msg.value - (msg.value / 100 * 5)); //5% tip
        emit TipSent(owner, msg.value);
    }

}
