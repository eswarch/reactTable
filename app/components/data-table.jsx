import React from 'react';

import SearchBar from './search-bar';
import PageNavigator from './page-navigator';

export function isPartialMatch(text, filter) {
	return text.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
}

export function getBeginningIndex(currentPage, itemsPerPage) {
	return (currentPage - 1) * itemsPerPage;
}

export function getEndingIndex(currentPage, itemsPerPage, numberOfItems) {
	return Math.min(currentPage * itemsPerPage, numberOfItems); 
}

let DataTable = ({
	currentPage, 
	filterText,
	itemsPerPage, 
	items, 
	itemProperties, 
	removeItem,
	reverseItems,
	sortItems,
	sortingProperty,
	switchPage,
	updateFilter
}) => {
  //TODO: use reselect's memoized selectors for filtering and pagination
	let filteredItems = items
  //TODO: refactor to allow filtering by all parameters
		.filter(item => isPartialMatch(item.get('name'), filterText));
		
	let beginningIndex = getBeginningIndex(currentPage, itemsPerPage);
	let endingIndex = getEndingIndex(currentPage, itemsPerPage, filteredItems.size); 
	
	let visibleItems = filteredItems.slice(beginningIndex, endingIndex);
	
	return (
		<div style={
			items.size > 0 ? 
				{ display: 'block' } :
				{ display: 'none' }
		}> 
			<div style={({ marginBottom: '1em' })}>
				<SearchBar 
					updateFilter={updateFilter} />
			</div>
			<PageNavigator 
				currentPage={currentPage} 
				filteredItems={filteredItems} 
				itemsPerPage={itemsPerPage}
				switchPage={switchPage} /> 
			<table className="u-full-width">
				<colgroup>
					<col style={({
						width: '25%'
					})} />
					<col style={({
						width: '45%'
					})} />
					<col style={({
						width: '15%'
					})} />
					<col style={({
						width: '15%'
					})} />
				</colgroup>
				<thead>
					<tr>
						{
							itemProperties.valueSeq().map(itemProperty => (
								<th 
									key={itemProperty.get('id')}
									style={
										sortingProperty === itemProperty.get('id') ? 
											{ fontStyle: 'italic' } :
											{ fontStyle: 'normal' }
									}
									onClick={
										() => sortingProperty !== itemProperty.get('id') ?
											sortItems(itemProperty.get('id')) :
											reverseItems()
									}
								>
									{itemProperty.get('description')}
								</th>
							))
						}
						<th></th>
					</tr>
				</thead>
				<tbody>
					{
						visibleItems.valueSeq().map(item => (
							<tr key={item.get('id')}>
								{
									itemProperties.valueSeq().map(itemProperty => (
										<td key={itemProperty.get('id')}>
											{item.get(itemProperty.get('id'))}
										</td>
									))
								}
								<td style={({
									padding: '12px 5px'
								})}>
								
								</td>
							</tr>
						))
					}
				</tbody>
			</table>
		</div>
	);
};

export default DataTable;
