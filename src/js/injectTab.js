require('../css/injectTab.css')


const legislationTitle = document.getElementById('ctl00_Cnt_documentNavigationHeader_documentTitle').innerText;
const sectionEl = document.querySelector('#legislation .label');
const section = sectionEl ? sectionEl.innerText : null;

if(section) {
    const id = "openLawNZListItem"
    const parentEl = document.querySelector('#legislationActions ul')

    const openLawListItem = document.createElement('li')
    const openLawButton = document.createElement('span')
    // TODO: Set aria role to button
    // We can't use a real button because the page is winforms
    const openLawButtonContents = document.createElement('span')

    openLawListItem.appendChild(openLawButton);
    openLawButton.appendChild(openLawButtonContents);
    parentEl.insertBefore(openLawListItem, parentEl.childNodes[2]);

    openLawListItem.id = id

    const openLawDialog = document.createElement('dialog')
    const closeDialogButton = document.createElement('span')
    const dialogContent = document.createElement('div')

    openLawDialog.id = id + "-dialog"
    document.body.appendChild(openLawDialog)

    closeDialogButton.id = openLawDialog.id + "-close"
    closeDialogButton.innerHTML = '&times;'

    closeDialogButton.onclick = () => {
        openLawDialog.close();
    }
    dialogContent.id = openLawDialog.id + "-wrap"
    openLawDialog.appendChild(dialogContent)

    openLawDialog.appendChild(closeDialogButton)

    openLawListItem.onclick = () => {

    fetch(`${process.env.API_URL}?query=${formatQuery(legislationTitle)}`, {
      method: 'GET'
    }).then((response) => {
        response.json().then(response => {
            
            // TODO: A better graphql query that has the section as a parameter rather than filtering
            let tableData = response.data.legislation.caseReferences.filter(data => data.section == section)
            dialogContent.innerHTML = '<p id="openLawNZListItem-header">Cases that refer to this section</p>'
            if(tableData.length > 0) {

                const tbody = tableData.map(caseReference => {

                    return `<tr>
                        <td class="case_name"><a href="https://www.openlaw.nz/case/${caseReference.case_id}" target="_blank" rel="noopener">${caseReference.case.case_name}</a></td>
                        <td class="case_citation">${caseReference.case.citations.length >0 ? caseReference.case.citations[0].citation : "Unknown"}</td>
                        
                        <td class="count">${caseReference.count}</td>
                    </tr>`
                }).join('')

                dialogContent.innerHTML += `
                
                <table>
                    <thead>
                        <tr>
                            <th class="case_name_col_head">Case name</th>
                            <th class="case_citation_col_head">Citation</th>
                            
                            <th class="count_col_head">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${tbody}
                        
                    </tbody>
                </table>
                
                </div>
            `
            // <th id="section_col_head">Section</th>
            // <td id="section">${caseReference.section}</td>
            } else {
                dialogContent.innerHTML += `<p id="${openLawDialog.id}-no-results">No results found</p>`
            }
            

            dialogContent.innerHTML += `<div id="openLawNZListItem-powered-by">
            <p>Powered by</p>
            <a href="https://www.openlaw.nz" target="_blank" rel="noopener">
                <svg alt="OpenLaw NZ" viewBox="0 0 388.844 126.52" width="388.844" height="126.52" style="width: 285.4px;"><defs><clipPath id="_clipPath_nJgcLX4xErFqeY6VWsbwAjrUICOAg3ga"><rect width="388.844" height="126.52"></rect></clipPath></defs><g clip-path="url(#_clipPath_nJgcLX4xErFqeY6VWsbwAjrUICOAg3ga)"><g id="Group"><path d=" M 13.738 57.864 C 13.738 68.296 22.134 76.437 32.057 76.437 C 41.979 76.437 50.037 68.296 50.037 57.864 C 50.037 47.433 41.979 39.461 32.057 39.461 C 22.05 39.461 13.738 47.433 13.738 57.864 Z  M 63.775 57.864 C 63.775 74.995 50.037 88.141 31.887 88.141 C 13.738 88.141 0 75.08 0 57.864 C 0 40.563 13.738 27.757 31.887 27.757 C 50.037 27.757 63.775 40.648 63.775 57.864 Z " fill="rgb(0,104,120)"></path><path d=" M 108.474 64.564 C 108.474 57.271 103.894 52.012 97.195 52.012 C 90.495 52.012 85.83 57.186 85.83 64.564 C 85.83 72.112 90.495 77.2 97.195 77.2 C 103.894 77.2 108.474 72.027 108.474 64.564 Z  M 121.703 64.988 C 121.703 78.812 113.308 88.056 100.502 88.056 C 94.141 88.056 89.137 85.512 85.83 80.932 L 85.83 104 L 72.77 104 L 72.77 41.92 L 85.83 41.92 L 85.83 48.62 C 89.053 44.04 94.056 41.496 100.247 41.496 C 113.053 41.496 121.703 50.91 121.703 64.988 Z " fill="rgb(0,104,120)"></path><path d=" M 160.126 61.002 C 159.956 54.981 156.055 51.079 150.033 51.079 C 144.267 51.079 140.365 54.981 139.348 61.002 L 160.126 61.002 Z  M 172.338 68.719 L 139.602 68.719 C 141.129 74.486 145.538 77.879 151.391 77.879 C 155.716 77.879 159.786 76.183 162.924 73.044 L 169.794 79.999 C 165.214 85.087 158.515 88.056 150.288 88.056 C 135.701 88.056 126.457 78.727 126.457 64.903 C 126.457 50.825 136.04 41.496 149.948 41.496 C 165.978 41.496 173.44 52.097 172.338 68.719 Z " fill="rgb(0,104,120)"></path><path d=" M 226.533 58.882 L 226.533 87.547 L 213.472 87.547 L 213.472 62.698 C 213.472 56.931 210.08 53.369 204.482 53.369 C 197.952 53.454 194.051 58.373 194.051 65.073 L 194.051 87.547 L 180.99 87.547 L 180.99 41.92 L 194.051 41.92 L 194.051 49.892 C 197.273 44.21 202.701 41.496 209.825 41.411 C 220.003 41.411 226.533 48.196 226.533 58.882 Z " fill="rgb(0,104,120)"></path><path d=" M 251.47 28.181 L 238.071 28.181 L 238.071 97.898 L 251.47 97.898 L 251.47 28.181 Z " fill="rgb(0,104,120)"></path><path d=" M 238.07 103.223 L 238.07 114.88 L 324.912 114.88 L 324.912 103.177 L 238.07 103.223 Z " fill="rgb(0,173,183)"></path><path d=" M 164.582 22.914 L 251.47 22.914 L 251.47 11.21 L 164.582 11.21 L 164.582 22.914 Z " fill="rgb(0,173,183)"></path><path d=" M 293.007 71.942 L 293.007 67.871 L 282.745 67.871 C 277.741 67.871 275.282 69.398 275.282 73.044 C 275.282 76.522 277.995 78.811 282.405 78.811 C 287.918 78.811 292.243 75.843 293.007 71.942 Z  M 293.092 87.546 L 293.092 82.204 C 290.038 86.02 285.119 88.14 278.759 88.14 C 269.006 88.14 263.07 82.204 263.07 73.892 C 263.07 65.327 269.261 60.238 280.455 60.153 L 293.007 60.153 L 293.007 59.305 C 293.007 54.471 289.784 51.672 283.508 51.672 C 279.438 51.672 274.689 53.029 269.939 55.659 L 265.868 46.669 C 272.653 43.276 278.505 41.411 286.477 41.411 C 298.689 41.411 305.728 47.517 305.813 57.779 L 305.898 87.546 L 293.092 87.546 Z " fill="rgb(0,104,120)"></path><path d=" M 323.117 41.92 L 333.294 74.571 L 343.132 41.92 L 355.937 41.92 L 365.945 74.571 L 375.953 41.92 L 388.844 41.92 L 372.221 87.547 L 359.161 87.547 L 349.323 57.44 L 339.57 87.547 L 326.51 87.547 L 309.802 42.005 L 323.117 41.92 Z " fill="rgb(0,104,120)"></path><path d=" M 336.459 101.395 C 332.014 101.395 328.396 105.012 328.396 109.458 C 328.396 113.902 332.014 117.52 336.459 117.52 C 340.904 117.52 344.522 113.902 344.522 109.458 C 344.522 105.012 340.904 101.395 336.459 101.395 Z  M 336.459 126.52 C 327.051 126.52 319.397 118.866 319.397 109.458 C 319.397 100.048 327.051 92.395 336.459 92.395 C 345.867 92.395 353.521 100.048 353.521 109.458 C 353.521 118.866 345.867 126.52 336.459 126.52 Z " fill="rgb(0,173,183)"></path><path d=" M 151.91 9 C 147.465 9 143.847 12.617 143.847 17.063 C 143.847 21.508 147.465 25.125 151.91 25.125 C 156.355 25.125 159.973 21.508 159.973 17.063 C 159.973 12.617 156.355 9 151.91 9 Z  M 151.91 34.125 C 142.502 34.125 134.848 26.471 134.848 17.063 C 134.848 7.654 142.502 0 151.91 0 C 161.318 0 168.972 7.654 168.972 17.063 C 168.972 26.471 161.318 34.125 151.91 34.125 Z " fill="rgb(0,173,183)"></path></g></g></svg>
            </a>`


        })
    })

    
    openLawDialog.showModal()
}

}



const formatQuery = (legislationTitle) => {

    return `{ 
        legislation(title: "'${legislationTitle}'") { 
            caseReferences { 
                case_id,
                count,
                section,
                case {
                    case_name,
                    citations {
                        citation
                    }
                }
            }
        }
    }`

}

